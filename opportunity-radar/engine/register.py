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

STATUSES = {
    "VERIFIED OPEN", "UPCOMING", "CLOSING SOON", "CLOSED",
    "SELECTION IN PROGRESS", "WITHDRAWN", "UNVERIFIED",
}
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
        "eligibility_verdict": finding.get("eligibility_verdict", "ELIGIBILITY UNCONFIRMED"),
        "score": finding.get("score"),
        "match_tier": finding.get("match_tier", "NOT SCORED"),
        "notes": finding.get("notes", ""),
    }
    if entry["status"] not in STATUSES:
        raise ValueError(f"unknown status {entry['status']!r} for {entry['vacancy_id']}")
    if not entry["verified"]:
        entry["status"] = "UNVERIFIED"
    elif entry["status"] == "VERIFIED OPEN" and entry["deadline"] and date.fromisoformat(entry["deadline"]) < run_date:
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


def render(run, changes, run_date, segments):
    checked = run.get("sources_checked", [])
    blocked = [source for source in checked if source["result"].startswith("blocked")]
    live = [change for change in changes if is_live(change, run_date)]
    lines = [
        f"# Opportunity Watch: {run_date:%d %b %Y}, IST",
        "",
        f"Gate: {run.get('gate', 'scan day')} · Sources attempted: {len(checked)} · "
        f"Blocked by network policy: {len(blocked)} · Live records: {len(live)}",
        "",
        "## Changes since previous scan",
        "",
    ]
    moved = [change for change in changes if change["change_type"] != "NO CHANGE"]
    if moved:
        lines += ["| Change | Institution — post | Deadline | Flag | Status |", "|---|---|---|---|---|"]
        for change in moved:
            lines.append(
                f"| {change['change_type']} | {change['institution']} — {change['official_title']} | "
                f"{change['deadline'] or 'not stated'} | {change['deadline_flag'] or '—'} | {change['status']} |"
            )
    else:
        lines.append("No changes in this run.")
    lines.append("")

    lines += ["## Priority actions (maximum 3)", ""]
    actions = run.get("priority_actions", [])[:3]
    lines += [f"{number}. {action}" for number, action in enumerate(actions, start=1)] or ["None this run."]
    lines.append("")

    coverage = run.get("coverage", {})
    for segment in segments["segments"]:
        lines += [f"## {segment['label']}", "", f"Coverage: {coverage.get(segment['id'], 'NOT SEARCHED THIS RUN')}", ""]
        rows = [change for change in live if change["segment"] == segment["id"]]
        if not rows:
            lines.append("No verified open vacancy in the sources checked. This is not a claim that none exist.")
        for row in rows:
            lines.append(
                f"- **{row['institution']} — {row['official_title']}** · {row['employment_type']} · "
                f"{row['location'] or 'location not stated'} · {row['status']} · deadline "
                f"{row['deadline'] or 'not stated'} {row['deadline_flag'] or ''} · {row['eligibility_verdict']} · "
                f"_{row['change_type']}_ · [source]({row['source_url'] or '#'})"
            )
        lines.append("")

    lines += ["## Unverified leads", ""]
    leads = [c for c in changes if c["status"] == "UNVERIFIED" and is_live(c, run_date)]
    lines += [f"- {c['institution']} — {c['official_title']} (deadline {c['deadline'] or 'not stated'}): {c['notes']}" for c in leads] or ["None."]
    history = [c for c in changes if c["status"] == "UNVERIFIED" and not is_live(c, run_date)]
    if history:
        lines += ["", "Past deadline per unverified sources (history, not actionable):", ""]
        lines += [f"- {c['institution']} — {c['official_title']} (deadline {c['deadline']})" for c in history]
    lines.append("")

    lines += ["## Coverage limitations", ""]
    limitations = list(run.get("limitations", []))
    limitations += [f"Blocked: {source['name']} ({source['url']})" for source in blocked]
    lines += [f"- {item}" for item in limitations] or ["None recorded."]
    lines.append("")
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
