SELECT
  id,
  name,
  category,
  location,
  created_by,
  estimated_value_cents,
  disposition_action,
  disposition_at,
  disposition_note,
  disposition_by,
  donation_reportable,
  decision_note,
  decided_by,
  decided_at,
  updated_at
FROM app_donations__items
WHERE status = 'let_go'
ORDER BY decided_at DESC, updated_at DESC
