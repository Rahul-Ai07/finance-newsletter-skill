import sys
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "engine"))
import register  # noqa: E402

RUN = date(2026, 10, 24)
ALERTS = {"closing_soon_days": 7, "urgent_days": 3}


def finding(**overrides):
    # Placeholder data for tests only. Not a real advertisement.
    base = {
        "segment": "S1_BANKING_FI",
        "institution": "Test Bank",
        "official_title": "Deputy General Manager (AI Governance)",
        "advertisement_number": "TEST-ADV-1",
        "status": "VERIFIED OPEN",
        "deadline": "2026-11-20",
        "verified": True,
        "source_url": "https://example.invalid/notice.pdf",
    }
    base.update(overrides)
    return base


def fresh_register():
    return {"schema_version": "3.0.0", "last_run_date": None, "vacancies": {}}


class VacancyIdTests(unittest.TestCase):
    def test_stable_across_case_and_spacing(self):
        a = register.vacancy_id("State Bank of India", "ADV/1", "AGM")
        b = register.vacancy_id("  state bank of india ", "adv/1", "agm")
        self.assertEqual(a, b)

    def test_agm_and_dgm_in_one_advert_stay_separate(self):
        agm = register.vacancy_id("SBI", "ADV/1", "AGM")
        dgm = register.vacancy_id("SBI", "ADV/1", "DGM")
        self.assertNotEqual(agm, dgm)


class MergeTests(unittest.TestCase):
    def test_new_then_no_change_then_updated(self):
        reg = fresh_register()
        first = register.merge(reg, {"findings": [finding()]}, RUN, ALERTS)
        self.assertEqual(first[0]["change_type"], "NEW")
        second = register.merge(reg, {"findings": [finding()]}, date(2026, 10, 26), ALERTS)
        self.assertEqual(second[0]["change_type"], "NO CHANGE")
        third = register.merge(reg, {"findings": [finding(deadline="2026-11-30")]}, date(2026, 10, 28), ALERTS)
        self.assertEqual(third[0]["change_type"], "UPDATED")
        self.assertEqual(third[0]["previous_status"], "VERIFIED OPEN")

    def test_unverified_open_claim_is_downgraded(self):
        reg = fresh_register()
        register.merge(reg, {"findings": [finding(verified=False)]}, RUN, ALERTS)
        stored = next(iter(reg["vacancies"].values()))
        self.assertEqual(stored["status"], "UNVERIFIED")

    def test_verified_open_with_past_deadline_becomes_closed(self):
        reg = fresh_register()
        changes = register.merge(reg, {"findings": [finding(deadline="2026-10-01")]}, RUN, ALERTS)
        self.assertEqual(changes[0]["status"], "CLOSED")

    def test_missing_open_vacancy_needs_verification(self):
        reg = fresh_register()
        register.merge(reg, {"findings": [finding()]}, RUN, ALERTS)
        changes = register.merge(reg, {"findings": []}, date(2026, 10, 26), ALERTS)
        self.assertEqual(changes[0]["change_type"], "NEEDS VERIFICATION")
        self.assertEqual(changes[0]["status"], "VERIFIED OPEN")

    def test_missing_vacancy_past_deadline_closes(self):
        reg = fresh_register()
        register.merge(reg, {"findings": [finding(deadline="2026-10-27")]}, RUN, ALERTS)
        changes = register.merge(reg, {"findings": []}, date(2026, 10, 28), ALERTS)
        self.assertEqual(changes[0]["change_type"], "CLOSED")
        self.assertEqual(next(iter(reg["vacancies"].values()))["status"], "CLOSED")

    def test_closed_then_verified_open_is_reopened(self):
        reg = fresh_register()
        register.merge(reg, {"findings": [finding(deadline="2026-10-01")]}, RUN, ALERTS)
        changes = register.merge(reg, {"findings": [finding(deadline="2026-11-15")]}, RUN, ALERTS)
        self.assertEqual(changes[0]["change_type"], "REOPENED")

    def test_unknown_status_is_rejected(self):
        with self.assertRaises(ValueError):
            register.merge(fresh_register(), {"findings": [finding(status="MAYBE")]}, RUN, ALERTS)

    def test_verified_open_without_deadline_is_listed(self):
        changes = register.merge(fresh_register(), {"findings": [finding(deadline=None)]}, RUN, ALERTS)
        self.assertEqual(changes[0]["status"], "LISTED")

    def test_source_confidence_defaults(self):
        reg = fresh_register()
        register.merge(reg, {"findings": [finding(), finding(official_title="AGM", verified=False)]}, RUN, ALERTS)
        levels = sorted(v["source_confidence"] for v in reg["vacancies"].values())
        self.assertEqual(levels, ["AGGREGATOR", "OFFICIAL_DIRECT"])

    def test_aggregator_cannot_be_marked_verified(self):
        with self.assertRaises(ValueError):
            register.merge(fresh_register(), {"findings": [finding(source_confidence="AGGREGATOR")]}, RUN, ALERTS)


class RenderTests(unittest.TestCase):
    def test_digest_lists_official_records_only_without_advice(self):
        reg = fresh_register()
        run = {"findings": [finding(), finding(official_title="AGM (Recovery)", verified=False)]}
        changes = register.merge(reg, run, RUN, ALERTS)
        text = register.render(run, changes, RUN, {"segments": [{"id": "S1_BANKING_FI", "label": "Banking"}]})
        self.assertIn("Deputy General Manager (AI Governance)", text)
        self.assertNotIn("AGM (Recovery)", text)
        self.assertNotIn("Priority actions", text)
        self.assertNotIn("ELIGIBILITY", text)


class DeadlineFlagTests(unittest.TestCase):
    def test_flags(self):
        self.assertEqual(register.deadline_flag("2026-10-26", RUN, ALERTS), "URGENT")
        self.assertEqual(register.deadline_flag("2026-10-31", RUN, ALERTS), "CLOSING SOON")
        self.assertIsNone(register.deadline_flag("2026-11-05", RUN, ALERTS))
        self.assertIsNone(register.deadline_flag("2026-10-20", RUN, ALERTS))
        self.assertIsNone(register.deadline_flag(None, RUN, ALERTS))


if __name__ == "__main__":
    unittest.main()
