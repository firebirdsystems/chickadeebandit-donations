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
