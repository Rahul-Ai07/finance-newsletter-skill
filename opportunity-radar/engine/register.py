"""Vacancy register for the opportunity radar.

Folds one scan's findings into state/register.json, applies the status rules
from the senior-banking skill, and renders the run digest.

    python3 opportunity-radar/engine/register.py state/runs/2026-10-24.json

The run file is written by the scan session. Its format is described in
opportunity-radar/README.md.
"""

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REGISTER = ROOT / "state" / "register.json"
REPORTS = ROOT / "reports"
SEGMENTS = ROOT / "config" / "segments.json"
SCHEDULE = ROOT / "config" / "schedule.json"

# LISTED: on the institution's current official listing, but its deadline was not read.
STATUSES = {
    "VERIFIED OPEN", "LISTED", "UPCOMING", "CLOSING SOON", "CLOSED",
    "SELECTION IN PROGRESS", "WITHDRAWN", "UNVERIFIED",
}
# OFFICIAL_DIRECT: page or PDF opened. OFFICIAL_INDEXED: official text returned by a
# search restricted to the institution's own domain. AGGREGATOR / USER_PROVIDED: not verified.
CONFIDENCE_LEVELS = {"OFFICIAL_DIRECT", "OFFICIAL_INDEXED", "AGGREGATOR", "USER_PROVIDED"}
CLOSED_STATES = {"CLOSED", "WITHDRAWN"}
TRACKED_FIELDS = ("status", "deadline", "eligibility_verdict", "score")


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "none"


def vacancy_id(institution, advertisement_number, official_title):
    """One ID per post, so an AGM and a DGM in the same advertisement stay separate."""
    return "--".join(slug(part) for part in (institution, advertisement_number or "", official_title))


def deadline_flag(deadline, run_date, alerts):
    if not deadline:
        return None
    days_left = (date.fromisoformat(deadline) - run_date).days
    if days_left < 0:
        return None
    if days_left <= alerts["urgent_days"]:
        return "URGENT"
    if days_left <= alerts["closing_soon_days"]:
        return "CLOSING SOON"
    return None


def is_live(entry, run_date):
    if entry["status"] in CLOSED_STATES:
        return False
    return not (entry["deadline"] and date.fromisoformat(entry["deadline"]) < run_date)


def normalise(finding, run_date):
    """Apply the skill's status rules: nothing is VERIFIED OPEN without an official source."""
    entry = {
        "vacancy_id": vacancy_id(finding["institution"], finding.get("advertisement_number"), finding["official_title"]),
        "segment": finding["segment"],
        "institution": finding["institution"],
        "official_title": finding["official_title"],
        "advertisement_number": finding.get("advertisement_number") or "",
        "employment_type": finding.get("employment_type", "UNKNOWN"),
        "location": finding.get("location", ""),
        "status": finding.get("status", "UNVERIFIED"),
        "deadline": finding.get("deadline"),
        "deadline_timezone": finding.get("deadline_timezone", "IST"),
        "source_url": finding.get("source_url", ""),
        "verified": bool(finding.get("verified", False)),
        "source_confidence": finding.get(
            "source_confidence", "OFFICIAL_DIRECT" if finding.get("verified") else "AGGREGATOR"),
        "published": finding.get("published", ""),
        "criteria": finding.get("criteria", ""),
        "eligibility_verdict": finding.get("eligibility_verdict", ""),
        "score": finding.get("score"),
        "match_tier": finding.get("match_tier", ""),
        "notes": finding.get("notes", ""),
    }
    if entry["status"] not in STATUSES:
        raise ValueError(f"unknown status {entry['status']!r} for {entry['vacancy_id']}")
    if entry["source_confidence"] not in CONFIDENCE_LEVELS:
        raise ValueError(f"unknown source_confidence {entry['source_confidence']!r} for {entry['vacancy_id']}")
    if entry["verified"] and entry["source_confidence"] not in {"OFFICIAL_DIRECT", "OFFICIAL_INDEXED"}:
        raise ValueError(f"{entry['vacancy_id']} is marked verified from a non-official source")
    if not entry["verified"]:
        entry["status"] = "UNVERIFIED"
    elif entry["status"] == "VERIFIED OPEN" and not entry["deadline"]:
        entry["status"] = "LISTED"
    elif entry["status"] == "VERIFIED OPEN" and date.fromisoformat(entry["deadline"]) < run_date:
        entry["status"] = "CLOSED"
    return entry


def merge(register, run, run_date, alerts):
    """Fold one run into the register in place and return this run's change records."""
    changes, seen = [], set()
    for finding in run["findings"]:
        entry = normalise(finding, run_date)
        vid = entry["vacancy_id"]
        seen.add(vid)
        previous = register["vacancies"].get(vid)
        if previous is None:
            entry["change_type"] = "NEW"
            entry["first_seen"] = run_date.isoformat()
            entry["previous_status"] = None
        else:
            entry["first_seen"] = previous["first_seen"]
            entry["previous_status"] = previous["status"]
            if previous["status"] in CLOSED_STATES and entry["status"] not in CLOSED_STATES:
                entry["change_type"] = "REOPENED"
            elif any(previous.get(field) != entry[field] for field in TRACKED_FIELDS):
                entry["change_type"] = "UPDATED"
            else:
                entry["change_type"] = "NO CHANGE"
        entry["last_seen"] = run_date.isoformat()
        register["vacancies"][vid] = entry
        changes.append(dict(entry))

    for vid, stored in register["vacancies"].items():
        if vid in seen or stored["status"] in CLOSED_STATES:
            continue
        past_deadline = bool(stored["deadline"]) and date.fromisoformat(stored["deadline"]) < run_date
        stored["previous_status"] = stored["status"]
        if past_deadline:
            stored["status"] = "CLOSED"
        stored["change_type"] = "CLOSED" if past_deadline else "NEEDS VERIFICATION"
        changes.append(dict(stored))

    for change in changes:
        change["deadline_flag"] = deadline_flag(change["deadline"], run_date, alerts)
    return changes


SOURCE_LABEL = {"OFFICIAL_DIRECT": "Official", "OFFICIAL_INDEXED": "Official (indexed)"}


def _date(value):
    return date.fromisoformat(value).strftime("%d %b %Y") if value else "Not stated"


def _table(rows, sectors, with_deadline):
    if not rows:
        return ["None.", ""]
    head = "| Sector | Institution | Post | Advertisement | Mode | Location |"
    head += " Closes |" if with_deadline else ""
    out = [head + " Source |", "|" + "---|" * (head.count("|")), ]
    for c in rows:
        flag = f" ({c['deadline_flag'].lower()})" if c.get("deadline_flag") else ""
        line = (f"| {sectors.get(c['segment'], c['segment'])} | {c['institution']} | {c['official_title']} | "
                f"{c['advertisement_number'] or '—'} | {c['employment_type']} | {c['location'] or '—'} |")
        line += f" {_date(c['deadline'])}{flag} |" if with_deadline else ""
        label = SOURCE_LABEL.get(c.get("source_confidence"), "Official")
        out.append(line + f" [{label}]({c['source_url']}) |")
    return out + [""]


def render(run, changes, run_date, segments):
    """Facts-only digest: official-source records only, with no opinions or advice."""
    sectors = {s["id"]: s["label"].split(" (")[0] for s in segments["segments"]}
    official = [c for c in changes if c["verified"]]
    open_now = sorted((c for c in official if c["status"] == "VERIFIED OPEN" and is_live(c, run_date)),
                      key=lambda c: c["deadline"])
    listed = [c for c in official if c["status"] == "LISTED"]
    closed = [c for c in official if not is_live(c, run_date)]
    moved = [c for c in official if c["change_type"] not in ("NO CHANGE",)]
    checked = run.get("sources_checked", [])
    unreachable = [s for s in checked if s["result"].startswith(("blocked", "unreachable"))]

    lines = [
        f"# Opportunity Watch: {run_date:%d %b %Y}",
        "",
        f"Official notices only. {len(open_now)} open with a published closing date, "
        f"{len(listed)} listed without a readable closing date, {len(closed)} closed.",
        "",
        "## Open now",
        "",
    ]
    lines += _table(open_now, sectors, with_deadline=True)
    lines += ["## Listed on official sites, closing date not in the text read", ""]
    lines += _table(listed, sectors, with_deadline=False)
    lines += ["## Published criteria", ""]
    criteria = [c for c in open_now + listed if c["criteria"]]
    lines += [f"- **{c['institution']}, {c['official_title']}:** {c['criteria']}" for c in criteria] or ["None in the text read."]
    lines += ["", "## Closed", ""]
    lines += _table(closed, sectors, with_deadline=True)
    lines += ["## Changes since the previous report", ""]
    lines += [f"- {c['change_type']}: {c['institution']}, {c['official_title']}" for c in moved] or ["None."]
    lines += ["", "## Sources", "", f"- Sources checked: {len(checked)}."]
    lines += [f"- Not reachable from the scan environment: {s['name']} ({s['url'] or 'no URL'})." for s in unreachable]
    lines += ["- Official (indexed): the text was read from the institution's own domain through a domain-restricted "
              "search, because the page could not be opened directly.", ""]
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Merge one scan run into the vacancy register and render its digest.")
    parser.add_argument("run_file", type=Path, help="state/runs/YYYY-MM-DD.json written by the scan")
    args = parser.parse_args(argv)

    run = json.loads(args.run_file.read_text(encoding="utf-8"))
    run_date = date.fromisoformat(run["run_date"])
    alerts = json.loads(SCHEDULE.read_text(encoding="utf-8"))["alerts"]
    segments = json.loads(SEGMENTS.read_text(encoding="utf-8"))
    register = json.loads(REGISTER.read_text(encoding="utf-8"))

    changes = merge(register, run, run_date, alerts)
    register["last_run_date"] = run_date.isoformat()
    REGISTER.write_text(json.dumps(register, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    REPORTS.mkdir(exist_ok=True)
    digest = REPORTS / f"{run_date.isoformat()}.md"
    digest.write_text(render(run, changes, run_date, segments), encoding="utf-8")

    counts = {}
    for change in changes:
        counts[change["change_type"]] = counts.get(change["change_type"], 0) + 1
    print(f"Register: {REGISTER}")
    print(f"Digest:   {digest}")
    print("Changes:  " + (", ".join(f"{k} {v}" for k, v in sorted(counts.items())) or "none"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
