SELECT
  id,
  name,
  category,
  estimated_value_cents,
  disposition_at,
  disposition_note,
  disposition_by,
  decided_at,
  decided_by
FROM app_donations__items
WHERE disposition_action = 'donated'
  AND donation_reportable = 'yes'
ORDER BY disposition_at DESC, decided_at DESC
