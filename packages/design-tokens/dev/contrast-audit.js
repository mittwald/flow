// @ts-check
/**
 * Reports WCAG 2.2 AA contrast of every content/background token pair in the
 * light and dark theme. Reads the built `dist/json-runtime`, so run it through
 * nx (`pnpm nx audit:contrast tokens`), which builds first.
 *
 * Flags: --all list passing and exempt pairs too, not just failures --json
 * print the raw results as JSON --strict exit 1 on `fail` or `large-only` (for
 * a future CI gate)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AA_LARGE_AND_UI,
  AA_TEXT,
  auditTheme,
  flattenTokens,
} from "./contrast-audit-lib.js";

const args = new Set(process.argv.slice(2));
const themes = ["light", "dark"];

const results = themes.flatMap((theme) => {
  const file = join(
    import.meta.dirname,
    `../dist/json-runtime/all-${theme}.json`,
  );
  return auditTheme(
    flattenTokens(JSON.parse(readFileSync(file, "utf8"))),
    theme,
  );
});

if (args.has("--json")) {
  console.log(JSON.stringify(results, null, 2));
} else {
  const statuses = /** @type {const} */ ([
    "fail",
    "large-only",
    "pass",
    "exempt",
    "unresolvable",
  ]);
  const count = (/** @type {string} */ theme, /** @type {string} */ status) =>
    results.filter((r) => r.theme === theme && r.status === status).length;

  console.log(
    `# Contrast audit — WCAG 2.2 AA (text ${AA_TEXT}:1, large text and UI ${AA_LARGE_AND_UI}:1)\n`,
  );
  console.log(`| theme | ${statuses.join(" | ")} |`);
  console.log(`| --- | ${statuses.map(() => "---:").join(" | ")} |`);
  for (const theme of themes) {
    console.log(
      `| ${theme} | ${statuses.map((s) => count(theme, s)).join(" | ")} |`,
    );
  }
  console.log(
    "\n`large-only`: text below 4.5:1 but at least 3:1 — passes for large text only. " +
      "`exempt`: disabled state (WCAG 1.4.3). " +
      "`unresolvable`: a value that is no plain color (gradient).",
  );

  const shown = results.filter((r) =>
    args.has("--all") ? true : r.status === "fail" || r.status === "large-only",
  );
  for (const theme of themes) {
    const rows = shown.filter((r) => r.theme === theme);
    if (rows.length === 0) continue;
    console.log(`\n## ${theme}\n`);
    console.log(
      "| status | ratio | need | content | background | state | backdrop | colors |",
    );
    console.log("| --- | ---: | ---: | --- | --- | --- | --- | --- |");
    for (const r of rows) {
      console.log(
        `| ${r.status} | ${r.ratio === null ? "–" : r.ratio.toFixed(2)} | ${r.required} | \`${r.content}\` | \`${r.background}\` | ${r.state} | ${r.backdrop} | ${r.colors ? `${r.colors.content} on ${r.colors.background}` : "–"} |`,
      );
    }
  }
}

if (
  args.has("--strict") &&
  results.some((r) => r.status === "fail" || r.status === "large-only")
) {
  process.exitCode = 1;
}
