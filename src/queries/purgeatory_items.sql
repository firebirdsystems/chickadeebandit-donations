SELECT
  id,
  name,
  category,
  location,
  created_by,
  decision_note,
  reevaluate_on,
  decided_by,
  decided_at,
  updated_at
FROM app_donations__items
WHERE status = 'unsure'
ORDER BY reevaluate_on ASC, updated_at DESC
