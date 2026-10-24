# Opportunity Radar

An alternate-day search engine for senior opportunities across Indian public-sector banks, DFS and DRT/DRAT deputation circulars, IBBI, central and state PSUs and government undertakings, Maharashtra cooperative and private banks, and international and UN development-finance bodies.

The search itself is done by Claude, following `.claude/skills/senior-banking-opportunity-intelligence/SKILL.md`. The Python in `engine/` handles the parts that must be exact: the alternate-day rhythm, stable vacancy IDs, status rules, change detection and the digest.

See [`docs/mind-map.md`](docs/mind-map.md) for the map of the whole system.

## Layout

```
opportunity-radar/
  config/
    schedule.json      cadence anchor, scheduled-task settings, alert thresholds, branch
    segments.json      industry segments S1–S8, keyword families, seed queries, official sources
  engine/
    cadence.py         alternate-day gate (exit 0 = scan today, 1 = skip)
    register.py        merges one run into the register and renders the digest
  state/
    register.json      vacancy register (every record ever seen, with status history)
    runs/              one JSON file per scan, the input to register.py
  reports/             one Markdown digest per scan
  tests/               unittest suite for the gate and the merge rules
```

## Cadence

- The scheduled task fires daily at 08:56 IST (`CRON_TZ=Asia/Kolkata 56 8 * * *`).
- `engine/cadence.py` counts whole IST days from `cadence.anchor_date` (2026-10-24) and scans every `interval_days` (2).
- Counting from a fixed anchor keeps the rhythm exact across month and year ends. A day-of-month cron such as `*/2` resets at month end, which would give two scans in a row.

```bash
python3 opportunity-radar/engine/cadence.py            # RUN or SKIP for today (IST)
python3 opportunity-radar/engine/cadence.py --today 2026-10-31
```

## Running a scan

1. `cadence.py` must print `RUN`. Otherwise stop.
2. Search each segment in `segments.json` using its `seed_queries` and the keyword families in the skill. Try each official source and record the result.
3. Write the run file (format below).
4. Merge it:

```bash
python3 opportunity-radar/engine/register.py opportunity-radar/state/runs/2026-10-24.json
```

This updates `state/register.json` and writes `reports/2026-10-24.md`.

5. Run the tests: `python3 -m unittest discover -s opportunity-radar/tests`

### Run file format

```json
{
  "run_date": "2026-10-24",
  "gate": "scan day",
  "sources_checked": [
    {"segment": "S1_BANKING_FI", "name": "SBI current openings", "url": "https://sbi.co.in/web/careers/current-openings", "result": "blocked_403"}
  ],
  "coverage": {"S1_BANKING_FI": "NOT VERIFIED. Official sites blocked (403). Search only."},
  "findings": [
    {
      "segment": "S3_RECOVERY_TRIBUNALS",
      "institution": "Department of Financial Services (Ministry of Finance)",
      "official_title": "Presiding Officer, DRT/DRAT",
      "advertisement_number": "",
      "employment_type": "DFS_CIRCULAR",
      "location": "Mumbai",
      "status": "UNVERIFIED",
      "deadline": "2026-11-09",
      "source_url": "https://…",
      "verified": false,
      "eligibility_verdict": "ELIGIBILITY UNCONFIRMED",
      "match_tier": "NOT SCORED",
      "notes": "…"
    }
  ],
  "priority_actions": ["At most three."],
  "limitations": ["…"]
}
```

Rules the engine enforces:

- `vacancy_id` = institution + advertisement number + post title. An AGM and a DGM in one advertisement are separate records.
- `verified: false` forces `status: UNVERIFIED`. Nothing is `VERIFIED OPEN` without an official source.
- A verified `VERIFIED OPEN` record whose deadline has passed becomes `CLOSED`.
- A stored open record missing from this run becomes `NEEDS VERIFICATION`, or `CLOSED` if its deadline has passed.
- `REOPENED`, `UPDATED`, `NO CHANGE` and `NEW` follow from comparing with the register.
- `URGENT` means a deadline within `alerts.urgent_days` (3). `CLOSING SOON` means within `alerts.closing_soon_days` (7). Both are date-precision.

## Notifications

The scheduled task is set to push a notification when a scan finishes with something worth reading. Email is off (`notifications.email` in `schedule.json`). Turn it on there if you want the digest by email.

## Network access

Official government and bank domains can be blocked by the environment network policy. A blocked attempt shows as `blocked_403`. The affected segment is then `NOT VERIFIED`, and the digest names the host. To let scans read those sources, add the hosts in the environment's network settings. The current list is in `config/segments.json`.

## Adding or changing a source

Edit `config/segments.json`. Set `provenance` to `search_result`, `skill_file` or `from_memory`. A `from_memory` URL has not been checked against a live page. Confirm it on the first run that can reach it.

## Limits

- The engine does not search. Search quality depends on the scan session following the skill.
- Dates from aggregators are shown as stated and are not reconciled with the official notice.
- Eligibility verdicts are provisional until the official clause is read and matched against the candidate profile in the skill.
- Nothing is submitted, paid or sent to third parties.
