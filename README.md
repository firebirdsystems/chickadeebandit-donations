# Let Go

A Chickadee Bandit app for household decluttering decisions.

Any household member can add an item, vote on what should happen to it, and leave context such as whether it was used recently, whether it is broken, whether repair makes sense, repair cost, estimated value, why someone wants to keep it, why someone wants to let it go, and whether it has a sensible home.

## Decision Buckets

- **Keep**: the item is archived as a kept item.
- **Let go**: the item appears in the let-go queue. Adults can later record whether it was donated, sold, recycled, discarded, given away, or handled another way.
- **Purge-atory**: the item is marked unsure with a six-month re-evaluation date.

Items are moved to **Archived** if the are marked for Keep or are officially marked as donated/trashed/etc.

Saving a follow-through action archives the item. Recorded actions can be reviewed in the in-app Reports tab or exported through the `action_report` query. Donated items can be marked reportable and exported through the `donation_report` query with their estimated values.

## Development

```bash
npm run dev
npm run build
npm test
```