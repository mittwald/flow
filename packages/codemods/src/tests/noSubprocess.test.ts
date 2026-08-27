import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

/**
 * `detect` and `verify` are pure Node: no `rg`, no `grep`, no `tsc`, no
 * subprocess of any kind — a compatibility requirement (Windows, a consumer
 * without ripgrep, a minimal CI container). This walks the actual source files
 * under the three directories that make up a check, rather than trusting a
 * code-review pass to have caught a stray import — enforced, not trusted, per
 * the plan.
 */
const roots = ["checks", "detect", "verify"].map((dir) =>
  fileURLToPath(new URL(`../${dir}`, import.meta.url)),
);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const sourceFiles = roots.flatMap((root) =>
  walk(root).filter((file) => file.endsWith(".ts")),
);

describe("the no-subprocess constraint", () => {
  test("src/checks, src/detect and src/verify contain at least the three proof modules", () => {
    // A sanity floor so this suite cannot silently pass by scanning zero
    // files if the paths above ever stop resolving.
    expect(sourceFiles.length).toBeGreaterThanOrEqual(8);
  });

  test("no module imports node:child_process", () => {
    const offenders = sourceFiles.filter((file) =>
      /from\s+["']node:child_process["']|require\(\s*["']node:child_process["']\s*\)/.test(
        readFileSync(file, "utf8"),
      ),
    );
    expect(offenders).toEqual([]);
  });
});
