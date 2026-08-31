SELECT
  id,
  name,
  category,
  status,
  estimated_value_cents,
  disposition_action,
  disposition_at,
  disposition_note,
  disposition_by,
  donation_reportable,
  decided_at,
  decided_by
FROM app_donations__items
WHERE disposition_action <> ''
ORDER BY disposition_at DESC, decided_at DESC
-- app_donations__items_action_report_idx is a PARTIAL index whose WHERE is the
-- WHERE above. Change one and the planner silently stops using it.
