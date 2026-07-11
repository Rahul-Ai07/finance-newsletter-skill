# A/B Testing Guide

## Variant construction rule

Every set of 3 variants must represent 3 genuinely different psychological angles — not word-swaps of the same idea. Use this fixed mapping:

- **Variant A — Rational/data-driven**: leads with a number, fact, or logical benefit. Appeals to System 2 (deliberate) thinking. Best for advisor/institutional audiences and higher-consideration products (mortgages, investment accounts).
- **Variant B — Emotional/aspirational**: leads with the outcome/feeling (security, freedom, confidence, belonging). Appeals to System 1 (fast, intuitive) thinking. Best for consumer/retail audiences and lifestyle-adjacent products (savings goals, rewards cards).
- **Variant C — Urgency/direct**: leads with a real time-bound or action-oriented framing. Only use when the urgency is genuine (real deadline, real limited window) — never fabricate scarcity in regulated financial products.

If a request doesn't naturally support all three angles (e.g., no real urgency exists), say so rather than inventing a fake urgency variant — offer a 2-variant test (A/B, not A/B/C) instead.

## What to test, in priority order

1. **Subject line** — highest leverage-to-effort ratio; determines whether the email is opened at all.
2. **Hero headline / opening line** — determines whether the reader continues past the first screen.
3. **Primary CTA text** — determines conversion given that the reader has engaged.
4. Lower priority (test only with adequate volume): send time, sender name, email length.

## Statistical validity

- Minimum recommended sample size per variant: 5,000 recipients, to detect a meaningful (~10%+ relative) lift in open/click rate at conventional confidence levels. Below this, results are noise-dominated — flag to the user if their list size is smaller.
- Run test variants simultaneously (not sequentially across different days/weeks) to control for time-based confounds (day-of-week, news events, market conditions — especially relevant for finance content).
- Test one variable at a time per send unless using a proper multivariate design — don't change subject line AND CTA in the same "A/B" test and attribute the lift to either alone.
- Predetermine the primary success metric before sending (open rate for subject line tests, click-through for CTA tests, conversion for full-funnel tests) — don't cherry-pick whichever metric looks best after the fact.

## Reporting expected lift

When presenting variants, describe the *hypothesis* behind the expected difference (e.g., "Variant B may outperform on open rate among retail/consumer segments based on the loss-aversion framing, per general fintech email benchmarks") rather than presenting a fabricated precise percentage as fact. Treat any lift estimate as a testable hypothesis, not a guarantee — real performance depends on the specific audience and must be validated with actual send data.

## Post-test actions

- Declare a winner only once the sample size and duration thresholds above are met.
- Roll the winning variant forward as the new control for the next test — don't re-test from scratch each time; iterate.
- Log which psychological angle won, by audience segment and content type, to build an internal pattern library over time (which angle wins for retail vs. advisor audiences, promotional vs. educational content, etc.).
