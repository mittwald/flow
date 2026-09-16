/**
 * Runs the visual corpus twice: once from React to write the references, once
 * from Vue to compare against them.
 *
 * Two processes rather than two environments in one run, because the reused
 * tests locate what they interact with through `page.getByRole(…)` — which has
 * to find exactly one tree.
 */
import {
  excludeUnsupportedFiles,
  excludeUnsupportedPattern,
  unsupportedFiles,
  unsupportedScenarios,
} from "../../e2e/react-parity/knownGaps.ts";
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "../..");
const config = "e2e/react-parity/vitest.config.ts";
const filters = process.argv.slice(2);

/*
 * Rebuilt every run. A committed reference would become a second source of
 * truth: the claim is "Vue renders what React renders today", not "what React
 * rendered when someone last updated a file".
 */
rmSync(path.join(packageRoot, "e2e/react-parity/.refs"), {
  recursive: true,
  force: true,
});

/*
 * The Vue pass skips what cannot be expressed in Vue at all. Filtered by name
 * rather than swallowed in the environment: several of those scenarios
 * interact with what they rendered, so a half-run leaves them timing out on an
 * empty page instead of reporting the reason.
 */
const run = (mode: "reference" | "compare"): number => {
  const exclude =
    mode === "compare" && filters.length === 0
      ? [...excludeUnsupportedFiles(), "-t", excludeUnsupportedPattern()]
      : [];
  console.log(
    `\n▶ ${mode === "reference" ? "React (writing references)" : "Vue (comparing)"}\n`,
  );
  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "vitest",
      "run",
      "--config",
      config,
      "--browser.headless",
      ...exclude,
      ...filters,
    ],
    {
      cwd: packageRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        FLOW_PARITY_MODE: mode,
        /*
         * The comparison must not write what it failed to find. A missing
         * reference means the reference pass never reached that scenario, and
         * `toMatchFileSnapshot` would otherwise create it and report a pass —
         * the one outcome that looks like parity and proves nothing. `CI`
         * makes vitest fail on a missing snapshot instead.
         */
        ...(mode === "compare" ? { CI: "true" } : {}),
      },
    },
  );
  return result.status ?? 1;
};

const referenceStatus = run("reference");
if (referenceStatus !== 0) {
  console.error(
    "\nThe reference pass failed. That is a broken harness or a broken visual test, not a Vue divergence.",
  );
  process.exit(referenceStatus);
}

const compareStatus = run("compare");

console.log("\nNot compared — cannot be expressed in Vue:");
for (const [file, reason] of Object.entries(unsupportedFiles)) {
  console.log(`  · ${file} (whole file) — ${reason}`);
}
for (const [name, reason] of Object.entries(unsupportedScenarios)) {
  console.log(`  · ${name} — ${reason}`);
}

process.exit(compareStatus);
