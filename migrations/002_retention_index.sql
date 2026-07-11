-- Retention prune scans the activity feed by age (created_at); this index lets the
-- daily runner find expired rows without a full-table scan and covers the id it deletes on.
CREATE INDEX IF NOT EXISTS donations_activity_retention_idx ON app_donations__activity (created_at, id);
