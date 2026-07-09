import { describe, it, expect } from "vitest";
import {
  statusLabels, dispositionLabels,
  esc, money, initial, colorFor, todayPlusMonths,
  memberName, isAdultMember, itemsForTab, reportRows, reportCsv,
  answerLabel, conditionLabel, csvCell,
} from "../src/logic.js";

describe("esc", () => {
  it("escapes HTML metacharacters", () => {
    expect(esc(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  });
  it("stringifies null/undefined to empty", () => {
    expect(esc(null)).toBe("");
    expect(esc(undefined)).toBe("");
  });
});

describe("money", () => {
  it("formats whole dollars without decimals", () => expect(money(2500)).toBe("$25"));
  it("formats partial dollars with two decimals", () => expect(money(2599)).toBe("$25.99"));
  it("returns 'Not set' for zero/empty", () => {
    expect(money(0)).toBe("Not set");
    expect(money(null)).toBe("Not set");
  });
});

describe("initial", () => {
  it("uppercases first character", () => expect(initial("alex")).toBe("A"));
  it("falls back to ? for empty", () => expect(initial("")).toBe("?"));
});

describe("colorFor", () => {
  it("is deterministic and in-palette", () => {
    const c = colorFor("demo-1");
    expect(c).toBe(colorFor("demo-1"));
    expect(["#1f5f4a", "#7c3aed", "#0369a1", "#b45309", "#be123c", "#0f766e"]).toContain(c);
  });
});

describe("todayPlusMonths", () => {
  it("adds months against an injected now", () => {
    expect(todayPlusMonths(3, new Date("2026-01-15T12:00:00"))).toBe("2026-04-15");
  });
});

describe("memberName", () => {
  const members = [{ id: "a", name: "Alex" }, { id: "b", name: "Jordan" }];
  it("resolves a known id", () => expect(memberName(members, "b")).toBe("Jordan"));
  it("falls back to 'Someone'", () => expect(memberName(members, "z")).toBe("Someone"));
});

describe("isAdultMember", () => {
  it("true for adult/admin", () => {
    expect(isAdultMember({ role: "adult" })).toBe(true);
    expect(isAdultMember({ role: "admin" })).toBe(true);
  });
  it("false for child/null", () => {
    expect(isAdultMember({ role: "child" })).toBe(false);
    expect(isAdultMember(null)).toBe(false);
  });
});

describe("itemsForTab", () => {
  const items = [
    { id: "1", status: "active" },
    { id: "2", status: "let_go" },
    { id: "3", status: "keep" },
    { id: "4", status: "archived" },
  ];
  it("filters by exact status", () => {
    expect(itemsForTab(items, "active").map(i => i.id)).toEqual(["1"]);
    expect(itemsForTab(items, "let_go").map(i => i.id)).toEqual(["2"]);
  });
  it("archive combines keep + archived", () => {
    expect(itemsForTab(items, "archive").map(i => i.id)).toEqual(["3", "4"]);
  });
  it("reports tab is always empty", () => {
    expect(itemsForTab(items, "reports")).toEqual([]);
  });
});

describe("reportRows", () => {
  const items = [
    { id: "1", disposition_action: "donated", disposition_at: "2026-03-01" },
    { id: "2", disposition_action: "sold", disposition_at: "2026-05-01" },
    { id: "3", disposition_action: "donated", disposition_at: "2026-08-01" },
    { id: "4", disposition_action: "", disposition_at: "" },
  ];
  it("excludes items without a disposition", () => {
    expect(reportRows(items, { from: "", to: "", action: "all" }).map(i => i.id)).toEqual(["3", "2", "1"]);
  });
  it("filters by action", () => {
    expect(reportRows(items, { from: "", to: "", action: "donated" }).map(i => i.id)).toEqual(["3", "1"]);
  });
  it("filters by date range", () => {
    expect(reportRows(items, { from: "2026-04-01", to: "2026-06-01", action: "all" }).map(i => i.id)).toEqual(["2"]);
  });
});

describe("answerLabel", () => {
  it("maps known values", () => {
    expect(answerLabel("yes")).toBe("Yes");
    expect(answerLabel("broken")).toBe("Broken");
  });
  it("defaults to Unknown", () => expect(answerLabel("weird")).toBe("Unknown"));
});

describe("conditionLabel", () => {
  it("describes broken items with repair status", () => {
    expect(conditionLabel({ broken_status: "broken", repair_possible: "maybe" })).toBe("Broken, repair maybe");
  });
  it("labels working items", () => {
    expect(conditionLabel({ broken_status: "working" })).toBe("Working");
  });
});

describe("csvCell", () => {
  it("quotes and escapes double quotes", () => {
    expect(csvCell(`he said "hi"`)).toBe(`"he said ""hi"""`);
  });
});

describe("reportCsv", () => {
  const items = [
    { name: "Bike", category: "Garage", disposition_action: "donated", disposition_at: "2026-03-01", estimated_value_cents: 800, donation_reportable: "yes", disposition_note: "thrift" },
  ];
  it("emits a header plus one row per disposition", () => {
    const csv = reportCsv(items, { from: "", to: "", action: "all" });
    const lines = csv.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("Item");
    expect(lines[1]).toContain("Bike");
    expect(lines[1]).toContain("Donated");
    expect(lines[1]).toContain("8.00");
  });
});

describe("label maps", () => {
  it("expose stable labels", () => {
    expect(statusLabels.let_go).toBe("Let go");
    expect(dispositionLabels.given_away).toBe("Given away");
  });
});
