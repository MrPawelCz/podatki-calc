# UX review — Podatki Calc 1.1.0

Date: 2026-10-13. Scope: public Polish sole-trader tax comparison, desktop and mobile.

## Joint product and tax decisions

The UX and tax reviewers agreed one flow and reviewed the integrated implementation:

1. Enter revenue streams and their costs, monthly or annually. Each amount label states its period. Period switching converts existing amounts rather than reinterpreting them.
2. Select the ZUS variant immediately. More specialised settings, monthly overrides, household income, eligibility and deductions use progressive disclosure.
3. See the comparative money left after costs and the incremental PIT, solidarity levy and contributions. Detailed components can be expanded and remain expanded during edits.
4. Treat unknown eligibility as a conditional simulation, not a recommendation that a tax form is legally available. Explicitly unavailable forms remain inspectable but cannot win. Unconfirmed MZ+ conditions affect every result.
5. Confirm the relevant form or ZUS conditions from links next to conditional results. Important caveats remain visible; only the recurring payment-estimation explanation is collapsed by default.

Tax reviewer accepted the integrated flow and the final wording for other-income social deductions, solidarity, nonnegative chart segments, and the example prior-year MZ+ values.

## Findings addressed

- **Misleading initial recommendation:** the previous empty form ranked a winner and displayed large losses. The revised initial state shows neutral comparison placeholders with a direct input action and a fictional example. A separate explicit action calculates a zero-revenue year.
- **Mobile result discovery:** the previous first comparison began 2,347 px down at 390 px width. A persistent bottom summary now shows the current leading scenario and provides a direct result link. Its target starts at the result heading, not the middle of a tall section. Results also provide a return-to-inputs link.
- **Difficulty comparing key numbers:** the three forms foreground money left, relative difference, conditional status and total burden. Detailed line items are expandable, not removed.
- **Hidden validation context:** invalid amounts and ZUS numerical eligibility now have associated inline messages. A linked error summary opens the relevant disclosure and focuses the affected field. Invalid scenarios clear stale results.
- **Mixed periods:** revenue and cost labels carry zł/mies. or zł/rok and each stream retains its annual equivalent.
- **Readability and interaction:** stronger muted contrast, visible control boundaries, larger inputs and major touch targets, keyboard focus, safe-area-aware mobile dock, no external fonts, and no decorative motion.
- **Ambiguous tax interpretation:** result text calls PIT a change against the non-business baseline. Detailed calculations distinguish the business tax from social deductions used against other income. Chart copy explicitly avoids describing loss/tax-saving scenarios as a balanced revenue breakdown.
- **Default MZ+ figures:** prior-year defaults are labelled as examples to replace with actual figures; zero/negative adjusted income handling is explicit.

## Visual direction

Preserve the user's existing BTL calculator family: pale green-grey canvas (#f3f5f4), white working surfaces, deep green text (#203632), restrained green actions (#187366), muted supporting text (#52665d), soft green summaries (#e9f4ef), amber conditional notices. System sans-serif typography keeps numbers legible without a font request. The primary contrast is between user inputs and the three tax forms; decoration does not compete with the comparison.

The frontend-design skill guided a restrained revision of the existing identity rather than a new visual brand. The ui-ux-pro-max accessibility search verified linked error-summary and inline-error patterns. Its progressive-disclosure search did not produce a specific matching rule; that structural choice is the reviewer's product judgment, not a claimed database recommendation.

## Verification before publication

- Inspected the existing public site in desktop and mobile Chromium.
- Inspected revised local markup and code in Chromium without navigating to a local server.
- Checked 320, 375, 390, 768, 844-landscape and 1280 px layouts: no horizontal overflow in the inspected scenarios.
- Checked mobile result navigation: result container began approximately 39 px below the viewport top after activation, before later wording-only changes.
- Checked expanded tax details survive input updates; checked invalid input association and numerical MZ+ errors through the shared DOM regression suite.
- Checked reduced-motion mode and a 200% body-font-size preview for overflow. This is not a claim of complete assistive-technology certification or all possible zoom configurations.
- Axe automated WCAG 2 A/AA and 2.1 AA scan of the revised mobile example: zero violations. Final public deployment checks are owned by the integrating agent and recorded separately.
- Screenshots are temporary review artifacts outside the public repository. No private financial figures are included.

Public-browser verification after deployment remains separate from local markup verification; see the release testing record for the delivered version.
