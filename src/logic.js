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

/**
 * Leading characters that make a spreadsheet treat a cell as a formula rather
 * than text. Tab and CR are included because Excel strips them before parsing,
 * so `\t=cmd` reaches the formula parser as `=cmd`.
 *
 * Kept character-for-character identical to the hub's own export guard
 * (cloudflare/reports.ts) — one product must not neutralise the same attack
 * two different ways.
 */
const CSV_FORMULA_LEAD = /^[=+\-@\t\r]/;

/**
 * One CSV cell: formula-neutralised, then quoted.
 *
 * Quoting is not a defence on its own. `"=cmd|' /C calc'!A0"` is a perfectly
 * well-formed quoted field that Excel, Sheets and LibreOffice hand to the
 * formula parser when the file is opened — so an item name or disposition note
 * typed by any household member executes on the machine of whoever exports the
 * donation report (often at tax time, often not the person who typed it).
 * A leading apostrophe is the spreadsheet's own "treat as text" marker.
 *
 * Neutralised at EXPORT rather than on the way in: the stored value is the
 * truth, the payload is dangerous only in a spreadsheet, and export-time also
 * covers rows already in the database. Same call, same rule, as the hub.
 */
export function csvCell(value) {
  const text = String(value ?? "");
  const guarded = CSV_FORMULA_LEAD.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
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
