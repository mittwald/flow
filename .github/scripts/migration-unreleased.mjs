#!/usr/bin/env node
// @ts-check
/**
 * `UNRELEASED` placeholder resolution + guard — IO shell around
 * `migration-unreleased-lib.mjs`.
 *
 * Two modes, both run by `/prepare-release` (see
 * `.claude/commands/prepare-release.md`, step 10):
 *
 * ```shell
 * pnpm release:resolve-unreleased --current 1.1.10 --target 1.2.0
 * pnpm release:check-unreleased
 * ```
 *
 * `resolve` rewrites every placeholder it finds and reports what changed.
 * `check` fails with exit 1 if any placeholder survives — a placeholder that
 * reaches a published release is a silent defect: the entry sits in the guide
 * with no version a reader can match to their own (#2890).
 *
 * The two are separate calls, not one, because a resolved catalogue entry only
 * reaches `packages/components/MIGRATION.md` through `pnpm nx build codemods`.
 * The check has to run after that regeneration to mean anything.
 *
 * Which files: globbed, not hardcoded, so a new package's guide is covered the
 * day it is added.
 *
 * - `packages/<pkg>/MIGRATION.md` — heading placeholders. A generated guide is
 *   skipped for writing (hand-editing it is reverted by the next build) but
 *   still scanned by `check`, which is where a leftover placeholder surfaces.
 * - `packages/codemods/src/migrations/<id>/entry.md` — the `since:` frontmatter
 *   field, the source of the generated guide.
 */
import { globSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  findPlaceholders,
  isGenerated,
  resolveEntrySince,
  resolveVersionHeadings,
  unreleasedPlaceholder,
} from "./migration-unreleased-lib.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));

const guidePattern = "packages/*/MIGRATION.md";
const entryPattern = "packages/codemods/src/migrations/*/entry.md";

/** @param {string} pattern */
const find = (pattern) =>
  globSync(pattern, { cwd: root }).toSorted((a, b) => a.localeCompare(b));

/** @param {string} path */
const read = (path) => readFileSync(join(root, path), "utf8");

/**
 * @param {string} path
 * @param {string} content
 */
const write = (path, content) =>
  writeFileSync(join(root, path), content, "utf8");

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {{ check: boolean; current?: string; target?: string }} */
  const args = { check: false };
  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index];
    if (flag === "--check") {
      args.check = true;
    } else if (flag === "--current" || flag === "--target") {
      const value = argv[++index];
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`${flag} needs a version.`);
      }
      args[flag === "--current" ? "current" : "target"] = value;
    } else {
      throw new Error(`Unknown argument "${flag}".`);
    }
  }
  return args;
}

function check() {
  const paths = [...find(guidePattern), ...find(entryPattern)];
  const findings = paths.flatMap((path) =>
    findPlaceholders(read(path)).map((finding) => ({ path, ...finding })),
  );

  if (findings.length === 0) {
    console.log(
      `No \`${unreleasedPlaceholder}\` placeholder left in ${paths.length} migration files.`,
    );
    return 0;
  }

  console.error(
    `::error::${findings.length} unresolved \`${unreleasedPlaceholder}\` placeholder(s) remain. A release must not ship a migration entry without a version.`,
  );
  for (const finding of findings) {
    console.error(`  ${finding.path}:${finding.line}: ${finding.text}`);
  }
  console.error(
    `Resolve them with \`pnpm release:resolve-unreleased --current <current> --target <target>\`, then \`pnpm nx build codemods\`.`,
  );
  return 1;
}

/**
 * @param {string} current
 * @param {string} target
 */
function resolve(current, target) {
  /** @type {string[]} */
  const changed = [];
  let catalogueTouched = false;

  for (const path of find(guidePattern)) {
    const source = read(path);
    if (isGenerated(source)) {
      if (findPlaceholders(source).length > 0) {
        console.log(
          `${path}: generated — its placeholder lives in the catalogue and is resolved there.`,
        );
      }
      continue;
    }

    const { markdown, collapsed } = resolveVersionHeadings(source, {
      current,
      target,
    });
    if (collapsed === 0) {
      continue;
    }

    write(path, markdown);
    changed.push(path);
    console.log(
      collapsed === 1
        ? `${path}: 1 placeholder heading resolved.`
        : `${path}: ${collapsed} placeholder headings collapsed into one.`,
    );
  }

  for (const path of find(entryPattern)) {
    const { source, changed: touched } = resolveEntrySince(read(path), target);
    if (!touched) {
      continue;
    }

    write(path, source);
    changed.push(path);
    catalogueTouched = true;
    console.log(`${path}: since → ${target}.`);
  }

  if (changed.length === 0) {
    console.log("No placeholders to resolve.");
    return 0;
  }

  console.log(
    `\nResolved ${changed.length} file(s) to \`${current}\` → \`>=${target}\`.`,
  );
  if (catalogueTouched) {
    console.log(
      "Run `pnpm nx build codemods` and commit the regenerated `packages/components/MIGRATION.md` and `packages/codemods/src/migrations.generated.ts`.",
    );
  }
  console.log("Then verify with `pnpm release:check-unreleased`.");
  return 0;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.check) {
    return check();
  }
  if (args.current === undefined || args.target === undefined) {
    console.error(
      `Usage: node ${relative(root, fileURLToPath(import.meta.url))} --current <version> --target <version>\n       node ${relative(root, fileURLToPath(import.meta.url))} --check`,
    );
    return 2;
  }
  return resolve(args.current, args.target);
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`::error::${error instanceof Error ? error.message : error}`);
  process.exitCode = 2;
}
