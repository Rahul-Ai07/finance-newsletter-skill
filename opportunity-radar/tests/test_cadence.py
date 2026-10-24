import sys
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "engine"))
import cadence  # noqa: E402

ANCHOR = date(2026, 10, 24)


class CadenceTests(unittest.TestCase):
    def test_anchor_is_a_scan_day(self):
        self.assertTrue(cadence.is_scan_day(ANCHOR, ANCHOR, 2))

    def test_alternate_days(self):
        self.assertFalse(cadence.is_scan_day(date(2026, 10, 25), ANCHOR, 2))
        self.assertTrue(cadence.is_scan_day(date(2026, 10, 26), ANCHOR, 2))

    def test_rhythm_survives_month_end(self):
        # 31 Oct is 7 days after the anchor (skip); 1 Nov is 8 days (scan).
        self.assertFalse(cadence.is_scan_day(date(2026, 10, 31), ANCHOR, 2))
        self.assertTrue(cadence.is_scan_day(date(2026, 11, 1), ANCHOR, 2))

    def test_rhythm_survives_year_end(self):
        self.assertTrue(cadence.is_scan_day(date(2026, 12, 31), ANCHOR, 2))
        self.assertFalse(cadence.is_scan_day(date(2027, 1, 1), ANCHOR, 2))

    def test_dates_before_anchor_are_skipped(self):
        self.assertFalse(cadence.is_scan_day(date(2026, 10, 23), ANCHOR, 2))
        self.assertEqual(cadence.next_scan_day(date(2026, 10, 23), ANCHOR, 2), ANCHOR)

    def test_next_scan_day(self):
        self.assertEqual(cadence.next_scan_day(date(2026, 10, 24), ANCHOR, 2), ANCHOR)
        self.assertEqual(cadence.next_scan_day(date(2026, 10, 25), ANCHOR, 2), date(2026, 10, 26))

    def test_next_scan_day_across_month_end(self):
        self.assertEqual(cadence.next_scan_day(date(2026, 10, 31), ANCHOR, 2), date(2026, 11, 1))

    def test_main_exit_codes(self):
        self.assertEqual(cadence.main(["--today", "2026-10-26"]), 0)
        self.assertEqual(cadence.main(["--today", "2026-10-27"]), 1)


if __name__ == "__main__":
    unittest.main()
