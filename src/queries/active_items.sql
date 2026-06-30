SELECT
  id,
  name,
  category,
  location,
  created_by,
  used_recently,
  broken_status,
  repair_possible,
  repair_cost_cents,
  estimated_value_cents,
  has_home,
  keep_reason,
  let_go_reason,
  created_at,
  updated_at
FROM app_donations__items
WHERE status = 'active'
ORDER BY updated_at DESC
