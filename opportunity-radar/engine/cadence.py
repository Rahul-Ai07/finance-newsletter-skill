"""Alternate-day gate for the opportunity scan. Exit 0 = scan today, 1 = skip.

The scheduled task fires every morning. This gate decides whether today (IST)
is a scan day: the anchor date in config/schedule.json, then every
interval_days after it. A fixed anchor keeps the rhythm exact across month and
year ends, which a cron day-of-month expression such as */2 does not.
"""

import argparse
import json
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

SCHEDULE = Path(__file__).resolve().parent.parent / "config" / "schedule.json"
IST = timezone(timedelta(hours=5, minutes=30))


def is_scan_day(today, anchor, interval_days):
    elapsed = (today - anchor).days
    return elapsed >= 0 and elapsed % interval_days == 0


def next_scan_day(today, anchor, interval_days):
    if today <= anchor:
        return anchor
    remainder = (today - anchor).days % interval_days
    return today + timedelta(days=(interval_days - remainder) % interval_days)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Alternate-day gate for the opportunity scan.")
    parser.add_argument("--today", type=date.fromisoformat, help="Override today's IST date (YYYY-MM-DD), for tests.")
    args = parser.parse_args(argv)

    cadence = json.loads(SCHEDULE.read_text(encoding="utf-8"))["cadence"]
    anchor = date.fromisoformat(cadence["anchor_date"])
    interval = cadence["interval_days"]
    today = args.today or datetime.now(IST).date()

    if is_scan_day(today, anchor, interval):
        print(f"RUN {today.isoformat()} (IST)")
        return 0
    upcoming = next_scan_day(today, anchor, interval)
    print(f"SKIP {today.isoformat()} (IST); next scan {upcoming.isoformat()}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
