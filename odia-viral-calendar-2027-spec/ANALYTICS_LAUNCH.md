# Analytics, Attribution, and Launch Plan

## Analytics events
Use Meta Pixel if the owner has consent/privacy requirements reviewed and the correct pixel ID configured.

| Event | Trigger | Notes |
|---|---|---|
| `PageView` | Page view | Include UTM context where available |
| `InitiateCheckout` | Every primary “Let's Odia this” CTA tap that opens/focuses order UI | Avoid firing on unrelated anchor clicks |
| `Purchase` | Confirmed paid order on thank-you/verified event | Deduplicate where supported; never fire on an unverified redirect alone |

Do not send names, phone numbers, street addresses, gift notes, or other personal data to analytics.

## UTM links
Create a unique tagged link for:
- Instagram bio
- Instagram stories
- WhatsApp broadcast
- Each creator/influencer
- Other campaigns as applicable

Use a consistent scheme, for example:
`?utm_source=instagram&utm_medium=bio&utm_campaign=odia_calendar_2027_preorder`

Keep a spreadsheet of the exact links used and the creator/channel owner.

## Pre-launch validation
- Test Pixel events in Meta Events Manager.
- Confirm Purchase fires only after a verified payment.
- Check analytics consent and privacy policy requirements.
- Confirm no personal data appears in URLs or event payloads.
- Verify link preview: title `The Odia Viral Calendar is back`; description `Pre-orders open for the first 500 boxes of the 2027 edition.`; image 1200×630 with box and cards on deep red.

## Launch sequence from brief
1. Three days before: tease the 2026 box beside a covered 2027 box, use “It's back”, countdown sticker.
2. First 24 hours: offer 2026 buyers early access via WhatsApp broadcast and DMs.
3. Day two: public launch, box-opening reel, “Raja came and went” carousel, bio link and story link.
4. Every day after: reshare buyer stories with permission and repost a 2026 story.
5. Last 100: enable the “Last 100” line only after owner verifies inventory; publish a final reminder.

## Success thresholds proposed in the brief
- 500 sold within 10 days: validated; size main print run for the 10,000 target and open batch 2 at ₹339, waitlist first.
- 500 sold in 11–30 days: demand exists but is slower; print a smaller first run and increase creator promotion.
- Under 250 by day 21: offer not validated at this stage; don't print at scale and investigate funnel drop-off.

Treat these as the brief's proposed thresholds, not guaranteed business outcomes.
