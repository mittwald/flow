/* global console, process -- Node CLI script */
/*
 * Turns results/*.jsonl into markdown tables:
 *
 *   node dev/perf/summarize.mjs [results-name …]   (default: every results file)
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const resultsDir = join(import.meta.dirname, "results");

const load = (name) => {
  const file = join(resultsDir, `${name}.jsonl`);
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
};

const ms = (v) =>
  v === undefined ? "–" : v >= 10 ? v.toFixed(0) : v.toFixed(1);

const listTable = (rows) => {
  const sizes = [...new Set(rows.map((r) => r.n))].sort((a, b) => a - b);
  const byScenario = new Map();
  for (const r of rows) {
    if (!byScenario.has(r.scenario)) byScenario.set(r.scenario, new Map());
    byScenario.get(r.scenario).set(r.n, r);
  }
  const lines = [
    `| scenario (ms, item renders) | ${sizes.map((n) => `n=${n}`).join(" | ")} |`,
    `|---|${sizes.map(() => "---|").join("")}`,
  ];
  for (const [scenario, bySize] of byScenario) {
    const cells = sizes.map((n) => {
      const r = bySize.get(n);
      if (!r) return "";
      if ("frameP95" in r)
        return `frame p95 ${ms(r.frameP95)} / max ${ms(r.frameMax)}`;
      return r.itemRenders ? `${ms(r.total)} (${r.itemRenders}×)` : ms(r.total);
    });
    lines.push(`| ${scenario} | ${cells.join(" | ")} |`);
  }
  return lines.join("\n");
};

const componentsTable = (rows) => {
  const byComponent = new Map();
  for (const r of rows) {
    if (!byComponent.has(r.component)) byComponent.set(r.component, {});
    byComponent.get(r.component)[r.scenario] = r;
  }
  const lines = [
    "| component | mount µs/inst. | re-render µs/inst. | fibers/inst. | DOM nodes/inst. |",
    "|---|---|---|---|---|",
  ];
  const sorted = [...byComponent].sort(
    (a, b) => b[1]["component:mount"].total - a[1]["component:mount"].total,
  );
  for (const [name, s] of sorted) {
    const m = s["component:mount"];
    const n = m.instances;
    const rerender = s["component:rerender"]?.total ?? 0;
    lines.push(
      `| ${name} | ${((m.total * 1000) / n).toFixed(0)} | ${((rerender * 1000) / n).toFixed(0)} | ${(m.fibers / n).toFixed(0)} | ${(m.dom / n).toFixed(1)} |`,
    );
  }
  return lines.join("\n");
};

const names = process.argv.slice(2);
const files = names.length
  ? names
  : existsSync(resultsDir)
    ? readdirSync(resultsDir)
        .filter((f) => f.endsWith(".jsonl"))
        .map((f) => f.replace(/\.jsonl$/, ""))
    : [];

/* A results file can hold any mix: the default run writes all suites to one. */
for (const name of files) {
  const rows = load(name);
  const componentRows = rows.filter((r) => r.scenario.startsWith("component:"));
  const fiberRows = rows.filter((r) => r.scenario === "fibersPerItem");
  const listRows = rows.filter(
    (r) => !componentRows.includes(r) && !fiberRows.includes(r),
  );

  const groups = new Map();
  for (const r of listRows) {
    const key = r.content ?? "table / infinite scroll";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  for (const [group, groupRows] of groups) {
    console.log(`\n### ${name} — List, ${group}\n\n${listTable(groupRows)}`);
  }
  for (const r of fiberRows) {
    const top = Object.entries(r.topComponents)
      .slice(0, 12)
      .map(([k, v]) => `${k} ${v}`)
      .join(", ");
    console.log(
      `\n### ${name} — ${r.content} item: ${r.fibersPerItem} fibers, ${r.domNodesPerItem} DOM nodes\n\n${top}`,
    );
  }
  if (componentRows.length) {
    console.log(
      `\n### ${name} — components\n\n${componentsTable(componentRows)}`,
    );
  }
}
