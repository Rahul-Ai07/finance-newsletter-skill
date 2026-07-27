import re
from typing import Dict, List

# RBI Compliance Guardrails
RBI_COMPLIANCE_RULES = {
    "no_guaranteed_returns": {
        "name": "No Guaranteed Returns Claims",
        "patterns": [r"guaranteed\s+return", r"assured\s+return", r"guaranteed\s+profit"],
        "severity": "critical"
    },
    "no_past_performance": {
        "name": "No Past Performance Guarantees",
        "patterns": [r"past\s+performance.*future", r"historical.*guarantee"],
        "severity": "high"
    },
    "no_misleading_claims": {
        "name": "No Misleading Investment Claims",
        "patterns": [r"risk-free", r"100%\s+safe", r"no\s+loss"],
        "severity": "critical"
    },
    "dark_pattern_check": {
        "name": "No Dark Patterns",
        "patterns": [r"limited\s+time\s+offer.*fake", r"only\s+today.*fabricated"],
        "severity": "high"
    },
    "transparency_check": {
        "name": "Transparent Terms & Conditions",
        "patterns": [r"terms.*condition", r"disclaimer", r"privacy"],
        "severity": "medium",
        "required": True
    }
}

EMAIL_BEST_PRACTICES = {
    "subject_line": {
        "name": "Subject Line Best Practices",
        "checks": [
            {"rule": "length_30_50", "min": 30, "max": 50},
            {"rule": "no_spam_words", "patterns": ["FREE!!!", "CLICK NOW", "URGENT ALERT"]}
        ]
    },
    "mobile_friendly": {
        "name": "Mobile-First Design",
        "checks": [{"rule": "preheader_length", "max": 100}]
    },
    "compliance_metadata": {
        "name": "Legal Compliance Metadata",
        "checks": [
            {"rule": "has_unsubscribe_link"},
            {"rule": "has_company_address"},
            {"rule": "has_contact_info"}
        ]
    }
}

def run_compliance_audit(newsletter_output: Dict) -> Dict:
    """Run comprehensive compliance audit on generated newsletter"""

    violations = []
    warnings = []
    passed_checks = []

    primary_copy = newsletter_output.get("primary_copy", "").lower()
    email_practices = newsletter_output.get("email_best_practices", [])

    # Check RBI Compliance
    for rule_key, rule in RBI_COMPLIANCE_RULES.items():
        rule_name = rule.get("name")
        patterns = rule.get("patterns", [])
        severity = rule.get("severity", "medium")
        is_required = rule.get("required", False)

        violations_found = []
        for pattern in patterns:
            if re.search(pattern, primary_copy, re.IGNORECASE):
                violations_found.append(pattern)

        if violations_found and severity == "critical":
            violations.append({
                "rule": rule_name,
                "severity": "critical",
                "message": f"Critical compliance violation: {rule_name}",
                "patterns_matched": violations_found
            })
        elif violations_found and severity == "high":
            violations.append({
                "rule": rule_name,
                "severity": "high",
                "message": f"High-severity compliance issue: {rule_name}",
                "patterns_matched": violations_found
            })
        elif violations_found:
            warnings.append({
                "rule": rule_name,
                "message": f"Review needed: {rule_name}",
                "patterns_matched": violations_found
            })
        else:
            passed_checks.append(rule_name)

    # Check Email Best Practices
    for practice_key, practice in EMAIL_BEST_PRACTICES.items():
        practice_name = practice.get("name")
        checks = practice.get("checks", [])

        for check in checks:
            rule = check.get("rule")

            if rule == "length_30_50":
                subject_lines = re.findall(r"subject:?\s*([^\n]+)", primary_copy)
                if subject_lines:
                    for sl in subject_lines:
                        length = len(sl)
                        if length < check.get("min", 30) or length > check.get("max", 50):
                            warnings.append({
                                "rule": "Subject line length",
                                "message": f"Subject line length ({length}) outside optimal range (30-50)",
                                "subject": sl
                            })
                        else:
                            passed_checks.append(f"Subject line length optimal")

            elif rule == "no_spam_words":
                patterns = check.get("patterns", [])
                for pattern in patterns:
                    if pattern.lower() in primary_copy:
                        warnings.append({
                            "rule": "Spam keywords",
                            "message": f"Contains potential spam word/phrase: {pattern}",
                            "severity": "medium"
                        })

    # Determine pass/fail
    has_critical_violations = any(v.get("severity") == "critical" for v in violations)
    passed = not has_critical_violations

    return {
        "passed": passed,
        "violations": violations,
        "warnings": warnings,
        "passed_checks": passed_checks,
        "summary": {
            "total_checks": len(passed_checks) + len(violations) + len(warnings),
            "passed": len(passed_checks),
            "issues": len(violations) + len(warnings),
            "critical_issues": len([v for v in violations if v.get("severity") == "critical"])
        }
    }
