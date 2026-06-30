CREATE TABLE IF NOT EXISTS app_donations__items (
  id                 TEXT NOT NULL,
  name               TEXT NOT NULL,
  category           TEXT NOT NULL DEFAULT '',
  location           TEXT NOT NULL DEFAULT '',
  photo_url          TEXT NOT NULL DEFAULT '',
  created_by         TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'active',
  visibility         TEXT NOT NULL DEFAULT 'household',
  used_recently      TEXT NOT NULL DEFAULT 'unknown',
  broken_status      TEXT NOT NULL DEFAULT 'unknown',
  repair_possible    TEXT NOT NULL DEFAULT 'unknown',
  repair_cost_cents  INTEGER NOT NULL DEFAULT 0,
  estimated_value_cents INTEGER NOT NULL DEFAULT 0,
  has_home           TEXT NOT NULL DEFAULT 'unknown',
  keep_reason        TEXT NOT NULL DEFAULT '',
  let_go_reason      TEXT NOT NULL DEFAULT '',
  decision_note      TEXT NOT NULL DEFAULT '',
  disposition_action TEXT NOT NULL DEFAULT '',
  disposition_at     TEXT NOT NULL DEFAULT '',
  disposition_note   TEXT NOT NULL DEFAULT '',
  disposition_by     TEXT NOT NULL DEFAULT '',
  donation_reportable TEXT NOT NULL DEFAULT 'no',
  reevaluate_on      TEXT NOT NULL DEFAULT '',
  decided_by         TEXT NOT NULL DEFAULT '',
  decided_at         TEXT NOT NULL DEFAULT '',
  created_at         TEXT NOT NULL,
  updated_at         TEXT NOT NULL,
  PRIMARY KEY (id),
  CHECK (status IN ('active', 'keep', 'let_go', 'unsure', 'archived')),
  CHECK (visibility IN ('household')),
  CHECK (used_recently IN ('unknown', 'yes', 'no', 'maybe')),
  CHECK (broken_status IN ('unknown', 'working', 'broken')),
  CHECK (repair_possible IN ('unknown', 'yes', 'no', 'maybe')),
  CHECK (has_home IN ('unknown', 'yes', 'no', 'maybe')),
  CHECK (disposition_action IN ('', 'donated', 'sold', 'recycled', 'discarded', 'given_away', 'other')),
  CHECK (donation_reportable IN ('yes', 'no'))
);

CREATE TABLE IF NOT EXISTS app_donations__votes (
  id          TEXT NOT NULL,
  item_id     TEXT NOT NULL,
  member_id   TEXT NOT NULL,
  vote        TEXT NOT NULL,
  note        TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (item_id, member_id),
  FOREIGN KEY (item_id) REFERENCES app_donations__items(id) ON DELETE CASCADE,
  CHECK (vote IN ('keep', 'let_go', 'unsure'))
);

CREATE TABLE IF NOT EXISTS app_donations__comments (
  id          TEXT NOT NULL,
  item_id     TEXT NOT NULL,
  member_id   TEXT NOT NULL,
  kind        TEXT NOT NULL DEFAULT 'comment',
  body        TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (item_id) REFERENCES app_donations__items(id) ON DELETE CASCADE,
  CHECK (kind IN ('comment'))
);

CREATE TABLE IF NOT EXISTS app_donations__activity (
  id          TEXT NOT NULL,
  item_id     TEXT NOT NULL,
  actor_id    TEXT NOT NULL,
  action      TEXT NOT NULL,
  detail      TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (item_id) REFERENCES app_donations__items(id) ON DELETE CASCADE,
  CHECK (action IN ('created', 'updated', 'commented', 'decision', 'disposition', 'deleted'))
);

CREATE INDEX IF NOT EXISTS donations_items_status_idx ON app_donations__items (status, updated_at);
CREATE INDEX IF NOT EXISTS donations_items_created_by_idx ON app_donations__items (created_by);
CREATE INDEX IF NOT EXISTS donations_items_reevaluate_idx ON app_donations__items (reevaluate_on);
CREATE INDEX IF NOT EXISTS donations_items_disposition_idx ON app_donations__items (disposition_action, disposition_at);
CREATE INDEX IF NOT EXISTS donations_items_status_disposition_idx ON app_donations__items (status, disposition_at);
CREATE INDEX IF NOT EXISTS donations_votes_item_idx ON app_donations__votes (item_id);
CREATE INDEX IF NOT EXISTS donations_comments_item_idx ON app_donations__comments (item_id, created_at);
CREATE INDEX IF NOT EXISTS donations_activity_item_idx ON app_donations__activity (item_id, created_at);
