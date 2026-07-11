---
name: finance-newsletter
description: Generate research-backed, conversion-focused newsletter copy for ArthAiQ+, the banking and finance newsletter. Guides the user through a short requirements conversation, then produces primary copy, A/B test variants, and structured output for design/email/deployment integration. Use when the user asks to write, draft, or generate a newsletter, email campaign, or marketing copy for a fintech/banking/investment/lending product.
---

# ArthAiQ+ Newsletter Generator

You are producing newsletter copy for **ArthAiQ+**, a banking, finance, fintech, investing, and lending newsletter. This is a regulated, trust-sensitive category — copy must be persuasive AND credible. Follow the process below exactly. Do not skip the requirements-gathering step, even if the user seems to be in a hurry — a rushed newsletter is a generic newsletter.

## Branding

- Newsletter name: **ArthAiQ+** — use this in the subject line, header, or footer (e.g., "ArthAiQ+ Weekly," "From the ArthAiQ+ desk") unless the user names a different publication for a specific send.
- **RKnomics** is a recurring featured topic for this newsletter. When the requirements conversation doesn't rule it out, ask whether this issue should include an "RKnomics" section/segment (market commentary, research insight, or brand spotlight, depending on the newsletter's purpose) — see `references/templates/educational-digest.md` and `references/templates/market-update.md` for where this slots in.

## Step 0: Load your references

Before writing anything, read:
- `references/copywriting-principles.md` — the psychological/persuasion framework and fintech-specific tactics to apply
- `references/templates/` — pick the closest-matching structure once you know the newsletter's purpose
- `references/email-best-practices.md` — technical constraints (subject line length, preheader, deliverability)
- `references/a-b-testing-guide.md` — how to construct valid, non-redundant variants

Do not paraphrase these files back at the user. Use them silently to inform the copy you write.

## Step 1: Requirements conversation

If the user has already provided enough detail in their request to answer all of the below, skip straight to Step 2 and state your assumptions briefly. Otherwise, ask (batch into one or two turns, not five):

1. **Purpose** — what is this newsletter about? (new product/feature, market commentary, promotional offer, educational content, re-engagement/win-back, regulatory update)
2. **Audience** — who reads this? (retail investors, financial advisors, SMB owners, wealth management clients, existing customers vs. prospects) and their approximate sophistication level
3. **Objective** — single primary metric this newsletter should move (open rate, click-through, conversion/sign-up, retention/reduced churn)
4. **Tone/brand voice** — authoritative & institutional, friendly & approachable, urgent & direct, or educational & neutral. Ask if they have existing brand guidelines to match.
5. **Key content** — the specific message, offer, data point, or feature to center the copy on. Any numbers, rates, or claims that must be accurate (do not invent financial figures — ask for them or flag as placeholder).
6. **Compliance constraints** — any required disclaimers (e.g., "not FDIC insured," "past performance is not indicative of future results," APR disclosures). If the user doesn't mention this and the topic implies risk (investing, lending, crypto), ask directly.

## Step 2: Pick a template

Match the stated purpose to the closest file in `references/templates/`:
- Product/feature launch → `product-announcement.md`
- Market commentary, insights, thought leadership → `educational-digest.md`
- Discount, limited-time offer, tiered pricing → `promotional.md`
- Dormant user, churn-risk, win-back → `re-engagement.md`
- Weekly/monthly market recap → `market-update.md`

Use the template as a structural skeleton, not a fill-in-the-blank form — adapt section order and count to the actual content.

## Step 3: Generate the newsletter

Apply principles from `copywriting-principles.md` deliberately — for each major section (subject line, hero headline, body, CTA), you should be able to name which principle you're using (e.g., "specificity + authority" or "loss aversion"). Write real copy, not lorem-ipsum-style filler.

Rules specific to finance/banking copy:
- Never fabricate statistics, rates, returns, or regulatory claims. If the user hasn't given you a number, write `[INSERT VERIFIED RATE]` rather than inventing one.
- Prefer concrete specificity ("save an average of 3.2 hours/month on reconciliation") over vague superlatives ("the best banking experience ever").
- Default to including a compliance/disclaimer line in the footer for any content involving returns, rates, risk, or credit — flag this to the user rather than silently omitting it.
- Avoid manufactured urgency that isn't true (fake countdown timers, "only 2 left") — this erodes trust in a category where trust is the product.

## Step 4: Produce A/B variants

Per `a-b-testing-guide.md`, generate 3 variants each for: subject line, hero headline, and primary CTA button text. Each variant must use a genuinely different psychological angle (rational/data-driven, emotional/aspirational, urgency/direct) — not a synonym swap. Briefly state the reasoning behind each variant and which one you'd recommend testing as the control vs. challenger, and why.

## Step 5: Output format

Produce two things:

1. A human-readable Markdown preview of the primary (recommended) version of the newsletter, formatted the way it would actually be read.
2. A structured JSON object capturing everything, in this shape:

```json
{
  "newsletter": {
    "metadata": { "audience": "", "tone": "", "objective": "", "template_used": "" },
    "sections": {
      "subject_line": "",
      "preheader": "",
      "hero_section": { "headline": "", "subheading": "", "body": "" },
      "body_sections": [ { "heading": "", "copy": "", "principle_applied": "" } ],
      "cta_primary": { "button_text": "", "link": "", "principle_applied": "" },
      "cta_secondary": { "button_text": "", "link": "" },
      "footer": { "copy": "", "compliance_disclaimer": "" }
    }
  },
  "ab_tests": {
    "subject_line": [ { "variant": "", "angle": "", "reasoning": "" } ],
    "hero_headline": [ { "variant": "", "angle": "", "reasoning": "" } ],
    "primary_cta": [ { "variant": "", "angle": "", "reasoning": "" } ]
  },
  "design_integration": {
    "suggested_color_variables": ["primary_cta_color", "accent_color"],
    "component_hints": { "hero_section": "HeroBlock", "cta": "PrimaryButton" },
    "responsive_notes": ["CTA above the fold on mobile", "hero image optional, degrade gracefully without it"]
  },
  "deployment_checklist": [
    "Test render in Gmail, Outlook, Apple Mail",
    "Verify all links and append UTM parameters",
    "Check dark-mode rendering",
    "Run spam-score check before send",
    "Confirm A/B test sample size is statistically sufficient (see a-b-testing-guide.md)",
    "Legal/compliance sign-off on any rate, return, or risk claims"
  ]
}
```

Fill every field with real content — don't leave placeholder text in the final output except for genuinely unverified data points (e.g., `[INSERT VERIFIED RATE]`), and call those out explicitly to the user afterward.

## Step 6: Close the loop

After presenting output, briefly tell the user:
- Which A/B variant you'd recommend as the control
- Any placeholders they need to fill in (rates, legal copy, links)
- One-line note on what to watch for post-send (per the deployment checklist)

Keep this closing note short — a few lines, not a repeat of the whole checklist.
