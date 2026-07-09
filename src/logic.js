// Pure, testable logic extracted from index.html.
// No DOM, no network — safe to import from Node for unit tests.

export const statusLabels = {
  active: "Deciding",
  keep: "Keep",
  let_go: "Let go",
  unsure: "Purge-atory",
  archived: "Archived",
};

export const dispositionLabels = {
  donated: "Donated",
  sold: "Sold",
  recycled: "Recycled",
  discarded: "Discarded",
  given_away: "Given away",
  other: "Other",
};

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

export function money(cents) {
  const n = Number(cents || 0);
  return n > 0 ? `$${(n / 100).toFixed(n % 100 === 0 ? 0 : 2)}` : "Not set";
}

export function initial(name) {
  return String(name || "?").trim().slice(0, 1).toUpperCase();
}

export function colorFor(id) {
  const colors = ["#1f5f4a", "#7c3aed", "#0369a1", "#b45309", "#be123c", "#0f766e"];
  let hash = 0;
  for (const ch of String(id || "")) hash = ((hash << 5) - hash) + ch.charCodeAt(0);
  return colors[Math.abs(hash) % colors.length];
}

export function todayPlusMonths(months, now = new Date()) {
  const d = new Date(now);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function memberName(members, id) {
  return members.find(m => m.id === id)?.name ?? "Someone";
}

export function isAdultMember(member) {
  return !!member && (member.role === "adult" || member.role === "admin");
}

export function itemsForTab(items, tab) {
  if (tab === "archive") {
    return items.filter(i => ["keep", "archived"].includes(i.status));
  }
  if (tab === "reports") return [];
  return items.filter(i => i.status === tab);
}

export function reportRows(items, reportState) {
  const from = reportState.from || "0000-01-01";
  const to = reportState.to || "9999-12-31";
  return items
    .filter(i => i.disposition_action && i.disposition_at)
    .filter(i => reportState.action === "all" || i.disposition_action === reportState.action)
    .filter(i => i.disposition_at >= from && i.disposition_at <= to)
    .sort((a, b) => String(b.disposition_at).localeCompare(String(a.disposition_at)));
}

export function answerLabel(value) {
  return ({ yes: "Yes", no: "No", maybe: "Maybe", unknown: "Unknown", working: "Working", broken: "Broken" })[value] ?? "Unknown";
}

export function conditionLabel(item) {
  if (item.broken_status === "broken") return `Broken, repair ${answerLabel(item.repair_possible).toLowerCase()}`;
  return answerLabel(item.broken_status);
}

export function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function reportCsv(items, reportState) {
  const header = ["Item", "Category", "Action", "Date", "Estimated Value", "Reportable Donation", "Notes"];
  const lines = reportRows(items, reportState).map(item => [
    item.name,
    item.category || "",
    dispositionLabels[item.disposition_action] ?? item.disposition_action,
    item.disposition_at,
    (Number(item.estimated_value_cents || 0) / 100).toFixed(2),
    item.donation_reportable === "yes" ? "yes" : "no",
    item.disposition_note || "",
  ]);
  return [header, ...lines].map(row => row.map(csvCell).join(",")).join("\n");
}
