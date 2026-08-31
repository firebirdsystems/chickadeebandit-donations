-- action_report.sql filters `disposition_action <> ''` (every item that has been
-- disposed of) and orders by disposition_at DESC, decided_at DESC with no LIMIT.
-- The existing disposition index leads on disposition_action, which a `<> ''`
-- inequality cannot seek, so every item was read and then sorted in a temp
-- b-tree.
--
-- A PARTIAL index solves both halves at once: its WHERE is the query's WHERE, so
-- the index contains exactly the disposed rows, already in the order the report
-- asks for. Keep the two WHERE clauses identical — SQLite only uses a partial
-- index when it can prove the query's restriction implies the index's.
--
-- These columns are plaintext because this app sets `db_encryption: "off"`. In
-- an app that encrypts, `<> ''` would still work (the codec leaves the empty
-- string unencrypted) but ordering on disposition_at would be fine and ordering
-- on a text column would not.
CREATE INDEX IF NOT EXISTS app_donations__items_action_report_idx
  ON app_donations__items (disposition_at DESC, decided_at DESC)
  WHERE disposition_action <> '';
