// @ts-check
/**
 * Resolution of the `UNRELEASED` migration placeholder — pure text, no IO.
 *
 * A migration entry authored in a `feat:` PR cannot name the version it applies
 * to: the PR lands on `next` and is promoted later, in a bundle whose stable
 * `x.y.0` depends on what else is promoted with it (#2890). The author writes
 * the literal `UNRELEASED` instead, and `/prepare-release` calls this while it
 * builds the release branch, once both versions are known.
 *
 * Two shapes carry a version, one per layer:
 *
 * - **`packages/codemods/src/migrations/<id>/entry.md`** — frontmatter field
 *   `since:`. The catalogue is the source of
 *   `packages/components/MIGRATION.md`, which is generated; the placeholder is
 *   resolved here and the guide is then regenerated (`pnpm nx build codemods`).
 *   Writing into the generated file would be reverted by the next build.
 * - **A hand-written `MIGRATION.md`** (today only `ext-bridge`'s) — a level-2
 *   heading of the form "## From version <x> to >=<y>", each version in
 *   backticks.
 *
 * Placeholder headings **collapse**: three promoted PRs each carrying one must
 * not produce three identical headings, so their bodies concatenate under a
 * single resolved heading, in document order, at the position of the first.
 *
 * The IO shell is `migration-unreleased.mjs`; the tests are
 * `migration-unreleased-lib.test.mjs`.
 */

/**
 * The literal an author writes in place of a version.
 *
 * Kept in sync with `unreleasedSince` in
 * `packages/codemods/src/catalog/unreleased.ts` — the catalogue's runtime has
 * to recognise the same string, and a test here asserts both spell it alike.
 */
export const unreleasedPlaceholder = "UNRELEASED";

const placeholderHeadingPattern = new RegExp(
  `^##\\s+From version\\s+\`?${unreleasedPlaceholder}\`?\\s+to\\s+\`?${unreleasedPlaceholder}\`?\\s*$`,
);

/** Frontmatter block of an `entry.md`, delimiters included. */
const frontmatterPattern = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

const sincePattern = new RegExp(
  `^(since:[ \\t]*)(['"]?)${unreleasedPlaceholder}\\2[ \\t]*$`,
  "m",
);

/**
 * Whether a `MIGRATION.md` is generated and must not be written to.
 *
 * `packages/components/MIGRATION.md` carries the marker; its placeholder lives
 * in the catalogue entry instead.
 *
 * @param {string} markdown
 */
export function isGenerated(markdown) {
  return markdown.includes("AUTO-GENERATED");
}

/**
 * The heading a resolved placeholder gets.
 *
 * `>=` on the upper bound is the existing convention and it earns its keep: if
 * another change ships first the reader is still routed correctly.
 *
 * @param {string} current The version the release starts from
 * @param {string} target The graduated version
 */
export function resolvedHeading(current, target) {
  return `## From version \`${current}\` to \`>=${target}\``;
}

/**
 * Splits a guide into its preamble and its level-2 sections.
 *
 * Fenced code is tracked, so a `## …` line inside a diff or shell block is not
 * mistaken for a heading.
 *
 * @param {string} markdown
 */
function splitSections(markdown) {
  /** @type {string[]} */
  const preamble = [];
  /** @type {{ heading: string; body: string[] }[]} */
  const sections = [];
  let fenced = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
    } else if (!fenced && line.startsWith("## ")) {
      sections.push({ heading: line, body: [] });
      continue;
    }
    (sections.at(-1)?.body ?? preamble).push(line);
  }

  return { preamble, sections };
}

/**
 * A section body without its trailing blank lines and `---` separator.
 *
 * The separator is inter-section glue, not content: keeping it would leave a
 * horizontal rule in the middle of a collapsed section, and `render` puts it
 * back between the sections that survive.
 *
 * @param {string[]} lines
 */
function sectionBody(lines) {
  const kept = [...lines];
  const dropBlanks = () => {
    while (kept.at(-1)?.trim() === "") kept.pop();
  };

  dropBlanks();
  if (kept.at(-1)?.trim() === "---") {
    kept.pop();
    dropBlanks();
  }
  return kept.join("\n").trim();
}

/**
 * Rewrites every placeholder heading to the resolved one and collapses them
 * into a single section.
 *
 * A document with no placeholder heading is returned byte-identical — the pass
 * runs over every guide, and most of them have nothing to do.
 *
 * @param {string} markdown
 * @param {{ current: string; target: string }} versions
 * @returns {{ markdown: string; collapsed: number }} `collapsed` counts the
 *   placeholder sections found; 1 means a rewrite with nothing to merge.
 */
export function resolveVersionHeadings(markdown, { current, target }) {
  const { preamble, sections } = splitSections(markdown);
  const placeholders = sections
    .map((section, index) =>
      placeholderHeadingPattern.test(section.heading) ? index : -1,
    )
    .filter((index) => index >= 0);

  const [first] = placeholders;
  if (first === undefined) {
    return { markdown, collapsed: 0 };
  }

  const collapsedBody = placeholders
    .map((index) => sectionBody(sections[index]?.body ?? []))
    .filter((body) => body !== "")
    .join("\n\n");

  const rendered = sections.flatMap((section, index) => {
    if (index === first) {
      return [`${resolvedHeading(current, target)}\n\n${collapsedBody}`];
    }
    if (placeholders.includes(index)) {
      return [];
    }
    return [`${section.heading}\n\n${sectionBody(section.body)}`];
  });

  const head = sectionBody(preamble);
  const parts = head === "" ? rendered : [head, ...rendered];

  return {
    markdown: `${parts.join("\n\n---\n\n")}\n`,
    collapsed: placeholders.length,
  };
}

/**
 * Rewrites a catalogue entry's `since: UNRELEASED` frontmatter field.
 *
 * Only `target` matters here: `since` names the version a change shipped in,
 * and the guide renders the range from it.
 *
 * @param {string} source The whole `entry.md`
 * @param {string} target The graduated version
 * @returns {{ source: string; changed: boolean }}
 */
export function resolveEntrySince(source, target) {
  const frontmatter = frontmatterPattern.exec(source)?.[0];
  if (frontmatter === undefined || !sincePattern.test(frontmatter)) {
    return { source, changed: false };
  }

  const resolved = frontmatter.replace(sincePattern, `$1${target}`);
  return {
    source: resolved + source.slice(frontmatter.length),
    changed: true,
  };
}

/**
 * Every line still carrying the placeholder — the guard's finding.
 *
 * Deliberately a plain substring scan rather than the heading and frontmatter
 * patterns: a placeholder that survives in a shape those do not match is
 * exactly the case the guard exists for.
 *
 * @param {string} text
 * @returns {{ line: number; text: string }[]}
 */
export function findPlaceholders(text) {
  return text
    .split("\n")
    .flatMap((line, index) =>
      line.includes(unreleasedPlaceholder)
        ? [{ line: index + 1, text: line.trim() }]
        : [],
    );
}
