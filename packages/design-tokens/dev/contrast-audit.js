// @ts-check
/**
 * Reports WCAG 2.2 AA contrast of every content/background token pair, and of
 * every single content color on the surfaces it renders on, in the light and
 * dark theme. Reads the built `dist/json-runtime`, so run it through nx (`pnpm
 * nx audit:contrast tokens`), which builds first.
 *
 * Flags:
 *
 * - `--all` list passing and exempt checks too, not just failures
 * - `--json` print the raw results as JSON
 * - `--strict` exit 1 on a failure the allowlist does not cover, on an
 *   allowlisted pair that got worse, and on a stale allowlist entry (the CI
 *   gate, `pnpm nx test:contrast tokens`)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ALLOWLIST } from "./contrast-audit-allowlist.js";
import {
  AA_LARGE_AND_UI,
  AA_TEXT,
  allowlistKey,
  auditTheme,
  checkAllowlist,
  flattenTokens,
  floorRatio,
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
const gate = checkAllowlist(results, ALLOWLIST);

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
  console.log(`| theme | ${statuses.join(" | ")} | allowlisted |`);
  console.log(`| --- | ${statuses.map(() => "---:").join(" | ")} | ---: |`);
  for (const theme of themes) {
    const allowlisted = results.filter(
      (r) =>
        r.theme === theme &&
        (r.status === "fail" || r.status === "large-only") &&
        gate.allowed.has(allowlistKey(r)),
    ).length;
    console.log(
      `| ${theme} | ${statuses.map((s) => count(theme, s)).join(" | ")} | ${allowlisted} |`,
    );
  }
  console.log(
    "\n`large-only`: text below 4.5:1 but at least 3:1 — passes for large text only. " +
      "`exempt`: disabled state (WCAG 1.4.3). " +
      "`unresolvable`: a value that is no plain color (gradient). " +
      "`allowlisted`: known failures in `dev/contrast-audit-allowlist.js`.",
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
      const status = gate.allowed.has(allowlistKey(r))
        ? `${r.status} (allowlisted)`
        : r.status;
      console.log(
        `| ${status} | ${r.ratio === null ? "–" : r.ratio.toFixed(2)} | ${r.required} | \`${r.content}\` | \`${r.background}\` | ${r.state} | ${r.backdrop} | ${r.colors ? `${r.colors.content} on ${r.colors.background}` : "–"} |`,
      );
    }
  }
}

if (args.has("--strict")) {
  const { unlisted, worse, stale } = gate;
  if (unlisted.length > 0) {
    console.error(
      `\n${unlisted.length} contrast failure(s) not in the allowlist. Fix the colors, or — reviewed, with a reason — add them to dev/contrast-audit-allowlist.js:\n`,
    );
    for (const r of unlisted) {
      console.error(
        `  ${JSON.stringify(allowlistKey(r))}: ${r.ratio === null ? "null" : floorRatio(r.ratio)}, // ${r.status}, needs ${r.required}`,
      );
    }
  }
  if (worse.length > 0) {
    console.error(
      `\n${worse.length} allowlisted pair(s) dropped below their recorded ratio:\n`,
    );
    for (const r of worse) {
      console.error(
        `  ${allowlistKey(r)}: ${r.ratio?.toFixed(2)} < ${r.floor}`,
      );
    }
  }
  if (stale.length > 0) {
    console.error(
      `\n${stale.length} allowlist entry(s) no longer fail — remove them from dev/contrast-audit-allowlist.js:\n`,
    );
    for (const key of stale) console.error(`  ${key}`);
  }
  if (unlisted.length + worse.length + stale.length > 0) {
    process.exitCode = 1;
  } else {
    console.error("\nContrast gate passed.");
  }
}
