// @ts-check
/**
 * `lerna.json`'s `changelogPreset` renders EVERY commit type (#3023).
 *
 * Release relevance is decided by PATH, the changelog by TYPE, and the two can
 * never agree: the `conventionalcommits` preset hides `docs`, `style`, `chore`,
 * `refactor`, `test`, `build` and `ci` by default, so a release those types
 * triggered had nothing to write and lerna emitted "Version bump only" — four
 * of the first fourteen post-1.0 releases. `chore(deps):` bumps are the
 * sharpest case: they change what consumers resolve and must stay releases, so
 * the changelog is what has to admit them.
 *
 * The gate is `writer.transform`, which returns `undefined` for a hidden type.
 * Asserting on it needs no git history and no rendering.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import createPreset from "conventional-changelog-conventionalcommits";

const { changelogPreset } = JSON.parse(
  readFileSync(join(import.meta.dirname, "..", "..", "lerna.json"), "utf8"),
);

/** Every Conventional Commit type the repo's commit guard accepts. */
const EXPECTED_SECTIONS = {
  feat: "Features",
  fix: "Bug Fixes",
  perf: "Performance Improvements",
  revert: "Reverts",
  docs: "Documentation",
  style: "Styles",
  chore: "Miscellaneous Chores",
  refactor: "Code Refactoring",
  test: "Tests",
  build: "Build System",
  ci: "Continuous Integration",
};

test("changelogPreset: the preset is configured, not just named", () => {
  // A bare string means the preset's defaults — which hide seven of the eleven
  // types. The object form is what carries `types`.
  assert.equal(typeof changelogPreset, "object");
  assert.equal(changelogPreset.name, "conventionalcommits");
  assert.ok(Array.isArray(changelogPreset.types));
});

test("changelogPreset: no configured type is hidden", () => {
  for (const entry of changelogPreset.types) {
    assert.notEqual(entry.hidden, true, entry.type);
    assert.ok(entry.section, `${entry.type} has no section`);
  }
});

test("changelogPreset: every commit type reaches the changelog", async () => {
  const preset = await createPreset(changelogPreset);
  const context = {
    host: "https://github.com",
    owner: "mittwald",
    repository: "flow",
  };

  for (const [type, section] of Object.entries(EXPECTED_SECTIONS)) {
    const commit = {
      type,
      scope: "components",
      subject: "a subject",
      hash: "0".repeat(40),
      notes: [],
      references: [],
    };
    const transformed = preset.writer.transform(commit, context);
    assert.ok(transformed, `${type} is dropped from the changelog`);
    assert.equal(transformed.type, section, type);
  }
});

test("changelogPreset: a chore(deps) bump renders", () => {
  // The case problem 2 of #3023 is about: it changes what consumers resolve,
  // so it must publish AND say so.
  assert.ok(
    changelogPreset.types.some(
      (entry) => entry.type === "chore" && entry.hidden !== true,
    ),
  );
});
