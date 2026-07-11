# Email Technical Best Practices

## Subject line & preheader
- Subject line: 30-50 characters for full visibility on mobile clients (iOS Mail truncates ~35-40 chars in portrait).
- Preheader: 40-100 characters, must add information not repeat the subject line — it's the second sentence, not a duplicate headline.

## Deliverability
- Avoid spam-trigger words in financial email specifically: "guarantee," "free money," "act now," "risk-free," excessive exclamation points, ALL-CAPS words.
- Maintain a healthy text-to-image ratio (aim 60/40 text-to-image minimum) — image-only emails are flagged more aggressively for financial-sender domains.
- Always include a plain-text fallback version.
- Include a visible, one-click unsubscribe link — expected under India's IT Act / SPAM guidelines and TRAI's commercial communication rules, and enforced by mailbox providers regardless of jurisdiction.

## Rendering
- Design mobile-first: 60%+ of financial services email opens are on mobile. Primary CTA must be visible without scrolling on a standard mobile viewport.
- Test dark mode explicitly — financial brand colors (often navy/dark blue) can invert unpredictably in some clients' automatic dark-mode rendering.
- Test across Gmail, Outlook (desktop and web, which render differently), and Apple Mail at minimum.

## Links & tracking
- Append UTM parameters to every link (source, medium, campaign, content) for attribution.
- Use a link-shortener or redirect service that supports click tracking without triggering "suspicious link" warnings — some banking-domain spam filters flag raw shortened links (bit.ly etc.) more than branded redirect domains.

## Compliance-adjacent technical requirements (RBI-aligned)
- Physical registered office address in the footer, plus sender identity clearly stated — expected for regulated entities (banks/NBFCs) under RBI's Fair Practices Code and general consumer-protection norms.
- If the newsletter references investment returns, interest rates, or credit terms, the disclosure must be legible and prominent (not hidden in tiny gray-on-white text) — RBI's Fair Practices Code and Digital Lending Guidelines (2022) require material terms to be disclosed as prominently as the headline claim, not buried in fine print.
- For any lending-adjacent content: include (or link to) a Key Fact Statement-style summary of the all-in cost of credit — this is a core requirement under the Digital Lending Guidelines, not optional boilerplate.
- Avoid dark-pattern email design (disguised ads as content, pre-selected opt-ins implying consent to further marketing) — flagged as an unfair practice under both RBI's digital lending framework and India's Consumer Protection (E-Commerce) Rules.

## Send-time & frequency
- B2B financial audiences (advisors, business banking): highest engagement Tuesday-Thursday, mid-morning in recipient's local time.
- Consumer/retail financial audiences: weekend and evening opens are competitive with weekday for consumer banking apps and personal finance content — test rather than assume weekday-only.
