// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  findPlaceholders,
  isGenerated,
  resolveEntrySince,
  resolveVersionHeadings,
  resolvedHeading,
  unreleasedPlaceholder,
} from "./migration-unreleased-lib.mjs";

const versions = { current: "1.1.10", target: "1.2.0" };
const resolved = "## From version `1.1.10` to `>=1.2.0`";
const placeholder = `## From version \`${unreleasedPlaceholder}\` to \`${unreleasedPlaceholder}\``;

const guide = (...sections) =>
  ["# Migrations", ...sections].join("\n\n---\n\n") + "\n";

test("resolvedHeading writes the `>=` upper bound", () => {
  assert.equal(resolvedHeading("1.1.10", "1.2.0"), resolved);
});

test("a single placeholder heading is rewritten, the body untouched", () => {
  const source = guide(`${placeholder}\n\n### Foo\n\nbody A`);

  const result = resolveVersionHeadings(source, versions);

  assert.equal(result.collapsed, 1);
  assert.equal(result.markdown, guide(`${resolved}\n\n### Foo\n\nbody A`));
});

test("three placeholder sections collapse under one heading, in document order", () => {
  const source = guide(
    `${placeholder}\n\n### Foo\n\nbody A`,
    `${placeholder}\n\n### Bar\n\nbody B`,
    `${placeholder}\n\n### Baz\n\nbody C`,
  );

  const result = resolveVersionHeadings(source, versions);

  assert.equal(result.collapsed, 3);
  assert.equal(
    result.markdown,
    guide(
      `${resolved}\n\n### Foo\n\nbody A\n\n### Bar\n\nbody B\n\n### Baz\n\nbody C`,
    ),
  );
  // The separators between the collapsed sections are gone — they were
  // inter-section glue, and a `---` inside one section reads as a rule.
  assert.equal(result.markdown.match(/^---$/gm)?.length, 1);
});

test("a file with no placeholder is returned byte-identical", () => {
  const source = guide(
    "## From version `1.0.0` to `>=1.0.1`\n\nbody A",
    "## From version `0.9.0` to `>=0.9.1`\n\nbody B",
  );

  const result = resolveVersionHeadings(source, versions);

  assert.equal(result.collapsed, 0);
  assert.equal(result.markdown, source);
});

test("placeholder and real headings mix: only the placeholders collapse, order kept", () => {
  const source = guide(
    `${placeholder}\n\n### New\n\nbody A`,
    "## From version `1.0.0` to `>=1.0.1`\n\nbody released",
    `${placeholder}\n\n### Also new\n\nbody B`,
    "## From version `0.9.0` to `>=0.9.1`\n\nbody older",
  );

  const result = resolveVersionHeadings(source, versions);

  assert.equal(result.collapsed, 2);
  assert.equal(
    result.markdown,
    guide(
      `${resolved}\n\n### New\n\nbody A\n\n### Also new\n\nbody B`,
      "## From version `1.0.0` to `>=1.0.1`\n\nbody released",
      "## From version `0.9.0` to `>=0.9.1`\n\nbody older",
    ),
  );
});

test("the collapsed section keeps the position of the first placeholder", () => {
  const source = guide(
    "## From version `1.0.0` to `>=1.0.1`\n\nbody released",
    `${placeholder}\n\n### New\n\nbody A`,
  );

  const result = resolveVersionHeadings(source, versions);

  assert.equal(
    result.markdown,
    guide(
      "## From version `1.0.0` to `>=1.0.1`\n\nbody released",
      `${resolved}\n\n### New\n\nbody A`,
    ),
  );
});

test("resolving is idempotent — a second pass finds nothing", () => {
  const once = resolveVersionHeadings(
    guide(`${placeholder}\n\nbody A`, `${placeholder}\n\nbody B`),
    versions,
  );
  const twice = resolveVersionHeadings(once.markdown, versions);

  assert.equal(twice.collapsed, 0);
  assert.equal(twice.markdown, once.markdown);
});

test("a `## ` line inside fenced code is not a heading", () => {
  const fenced = [
    placeholder,
    "",
    "```md",
    "## From version `9.9.9` to `>=9.9.9`",
    "```",
  ].join("\n");

  const result = resolveVersionHeadings(guide(fenced), versions);

  assert.equal(result.collapsed, 1);
  assert.match(result.markdown, /```md\n## From version `9\.9\.9`/);
});

test("the heading matches without backticks too", () => {
  const source = guide(
    `## From version ${unreleasedPlaceholder} to ${unreleasedPlaceholder}\n\nbody A`,
  );

  assert.equal(resolveVersionHeadings(source, versions).collapsed, 1);
});

test("resolveEntrySince rewrites the frontmatter field", () => {
  const source = [
    "---",
    `since: ${unreleasedPlaceholder}`,
    'title: "Something changed"',
    "kind: migration",
    "---",
    "",
    "Body prose.",
  ].join("\n");

  const result = resolveEntrySince(source, "1.2.0");

  assert.equal(result.changed, true);
  assert.match(result.source, /^since: 1\.2\.0$/m);
  assert.match(result.source, /Body prose\./);
});

test("resolveEntrySince accepts a quoted placeholder", () => {
  const result = resolveEntrySince(
    `---\nsince: "${unreleasedPlaceholder}"\n---\n\nBody.\n`,
    "1.2.0",
  );

  assert.equal(result.changed, true);
  assert.match(result.source, /^since: 1\.2\.0$/m);
});

test("resolveEntrySince leaves a released entry alone", () => {
  const source = "---\nsince: 1.0.16\nkind: migration\n---\n\nBody.\n";

  assert.deepEqual(resolveEntrySince(source, "1.2.0"), {
    source,
    changed: false,
  });
});

test("resolveEntrySince ignores the placeholder outside the frontmatter", () => {
  // Prose mentioning the convention must not be mistaken for the field.
  const source = [
    "---",
    "since: 1.0.16",
    "---",
    "",
    `Write \`since: ${unreleasedPlaceholder}\` in a feat PR.`,
  ].join("\n");

  assert.equal(resolveEntrySince(source, "1.2.0").changed, false);
});

test("findPlaceholders reports every line, with 1-based numbers", () => {
  const findings = findPlaceholders(
    `a\n${placeholder}\nb\nsince: ${unreleasedPlaceholder}\n`,
  );

  assert.deepEqual(
    findings.map(({ line }) => line),
    [2, 4],
  );
  assert.equal(findings[1]?.text, `since: ${unreleasedPlaceholder}`);
});

test("findPlaceholders is empty for a resolved document", () => {
  assert.deepEqual(findPlaceholders(guide(`${resolved}\n\nbody A`)), []);
});

test("isGenerated recognises the generated guide, not a hand-written one", () => {
  assert.equal(
    isGenerated(
      "# Migrations\n\n<!-- AUTO-GENERATED by `pnpm nx build codemods`",
    ),
    true,
  );
  assert.equal(isGenerated(guide(`${resolved}\n\nbody A`)), false);
});

test("the placeholder literal matches the catalogue's", () => {
  // `packages/codemods/src/catalog/unreleased.ts` is the runtime half: the CLI
  // has to recognise the same string this script writes. Two literals in two
  // languages, so assert they agree rather than trust the comment.
  const catalogue = readFileSync(
    fileURLToPath(
      new URL(
        "../../packages/codemods/src/catalog/unreleased.ts",
        import.meta.url,
      ),
    ),
    "utf8",
  );

  assert.match(
    catalogue,
    new RegExp(`unreleasedSince = "${unreleasedPlaceholder}"`),
  );
});

test("the real ext-bridge guide round-trips unchanged", () => {
  // Guards the parser against the shape it actually has to preserve: a
  // no-placeholder pass over a live file must not reformat a single byte.
  const path = fileURLToPath(
    new URL("../../packages/ext-bridge/MIGRATION.md", import.meta.url),
  );
  const source = readFileSync(path, "utf8");

  const result = resolveVersionHeadings(source, versions);

  assert.equal(result.collapsed, 0);
  assert.equal(result.markdown, source);
});

test("a placeholder prepended to the real ext-bridge guide resolves in place", () => {
  const path = fileURLToPath(
    new URL("../../packages/ext-bridge/MIGRATION.md", import.meta.url),
  );
  const source = readFileSync(path, "utf8");
  const withPlaceholder = source.replace(
    "\n---\n\n## From version",
    `\n---\n\n${placeholder}\n\n### Something new\n\nbody A\n\n---\n\n## From version`,
  );

  const result = resolveVersionHeadings(withPlaceholder, versions);

  assert.equal(result.collapsed, 1);
  assert.match(
    result.markdown,
    /# Migrations\n\n---\n\n## From version `1\.1\.10` to `>=1\.2\.0`\n\n### Something new\n\nbody A\n\n---\n\n## From version `0\.2\.0-alpha\.1050`/,
  );
  // Everything below the new section survives untouched.
  assert.equal(
    result.markdown.slice(result.markdown.indexOf("## From version `0.2.0")),
    source.slice(source.indexOf("## From version `0.2.0")),
  );
});
