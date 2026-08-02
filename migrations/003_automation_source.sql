-- Automation support for the `add_item` action.
--
-- `source_event_id` records which app event produced the row. The dispatcher's
-- dedupe guard matches on it (SELECT 1 FROM ... WHERE source_event_id = ?
-- LIMIT 1), so a redelivered event reuses the item already up for decision
-- instead of listing it twice.
--
-- Nullable on purpose: items added by hand have no source event, and the guard
-- only ever looks for a specific non-null id.
ALTER TABLE app_donations__items ADD COLUMN source_event_id TEXT;

CREATE INDEX IF NOT EXISTS app_donations__idx_items_source_event_id
  ON app_donations__items(source_event_id);
