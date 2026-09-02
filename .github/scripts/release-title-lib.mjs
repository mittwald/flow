// @ts-check
/**
 * Release intent from a commit SUBJECT — pure functions, no git / no IO.
 *
 * The title decides whether a merge releases; the path classifier
 * (`release-relevance-lib.mjs`) only verifies that the title told the truth
 * (#3023). That split is deliberate: a release decision a maintainer can read
 * off the PR title is worth more than one derived from a file list nobody sees,
 * and the verification keeps the readable signal honest.
 *
 * The type carries the intent, not the effect — `docs(codemods):` can change
 * the shipped migration catalogue, `fix(ci):` can reach nobody. So the type
 * gives a DEFAULT and a `[release]` / `[no-release]` tag overrides it. Only the
 * ~20% of titles that contradict their type need a tag; the rest stay as they
 * are.
 */

/**
 * Types whose changes reach a consumer unless a tag says otherwise.
 *
 * The same four the changelog renders as user-facing sections. Everything else
 * — `docs`, `ci`, `chore`, `test`, `build`, `style`, `refactor` — defaults to
 * not releasing and needs `[release]` when it does.
 */
const PUBLISHING_TYPES = new Set(["feat", "feature", "fix", "perf", "revert"]);

/**
 * Types that do not reach a consumer unless a `[release]` tag says otherwise.
 *
 * Listed rather than inferred as "everything else": a type nobody anticipated
 * must fall back to the paths, not silently count as non-publishing. Keep in
 * step with the types `commit-guard.yml` accepts and `lerna.json` renders.
 */
const NON_PUBLISHING_TYPES = new Set([
  "docs",
  "style",
  "chore",
  "refactor",
  "test",
  "build",
  "ci",
]);

/**
 * Scopes whose subjects are machine-generated, so no human chose the type.
 *
 * Dependabot writes `build(deps-dev): bump the dev-minor group …`. A group is
 * not homogeneous in effect — Rollup, Vite, TypeScript and Sass move every
 * `dist`, ESLint and Prettier move nothing — and `commit-message.prefix` is
 * configured per ecosystem, not per group, so no title Dependabot can produce
 * would be true for all of them. These fall back to the paths.
 */
const GENERATED_SCOPES = new Set(["deps", "deps-dev"]);

/** Parsed Conventional Commit header, or `undefined` when it is not one. */
function parseHeader(subject) {
  const match = /^([a-z]+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/.exec(subject.trim());
  if (!match) return undefined;
  return { type: match[1], scope: match[2], description: match[4] };
}

/**
 * Release intent of a commit subject.
 *
 * `publish: undefined` means the subject cannot answer it and the caller must
 * fall back to the paths. That is not a failure — three classes legitimately
 * land there:
 *
 * - **`chore(sync):`** — a forward-merge carries whatever `main` accumulated.
 *   Re-publishing `next` on a forward-merged fix is the point (ADR 0004 §6),
 *   and the merge's own subject says nothing about its content.
 * - **Dependabot** — see `GENERATED_SCOPES`.
 * - **An unparsable subject or an unknown type** — fail safe.
 *
 * @param {string} subject First line of the commit message.
 * @returns {{
 *   publish: boolean | undefined;
 *   source: "tag" | "type" | "machinery" | "unknown";
 *   reason: string;
 *   conflict?: true;
 * }}
 */
export function classifyTitle(subject) {
  const text = (subject ?? "").split("\n")[0].trim();

  const wantsRelease = /\[release\]/.test(text);
  const wantsNoRelease = /\[no-release\]/.test(text);

  if (wantsRelease && wantsNoRelease) {
    return {
      publish: undefined,
      source: "unknown",
      reason: "the title carries both [release] and [no-release]",
      conflict: true,
    };
  }

  const header = parseHeader(text);

  // The release machinery's own commits, before the tag: their meaning is
  // structural, and a tag on them would be a contradiction to resolve.
  if (header?.type === "chore" && header.scope === "release") {
    return {
      publish: false,
      source: "machinery",
      reason: "chore(release): is the version bump this workflow pushed itself",
    };
  }
  if (header?.type === "chore" && header.scope === "promotion") {
    return {
      publish: true,
      source: "machinery",
      reason: "chore(promotion): IS the release it promotes",
    };
  }
  if (header?.type === "chore" && header.scope === "sync") {
    return {
      publish: undefined,
      source: "machinery",
      reason:
        "chore(sync): is a forward-merge — its content decides, not its subject",
    };
  }

  if (wantsRelease || wantsNoRelease) {
    return {
      publish: wantsRelease,
      source: "tag",
      reason: `the title carries [${wantsRelease ? "release" : "no-release"}]`,
    };
  }

  if (!header) {
    return {
      publish: undefined,
      source: "unknown",
      reason: "the subject is not a Conventional Commit header",
    };
  }

  if (header.scope !== undefined && GENERATED_SCOPES.has(header.scope)) {
    return {
      publish: undefined,
      source: "machinery",
      reason: `${header.type}(${header.scope}): is generated — its content decides`,
    };
  }

  if (PUBLISHING_TYPES.has(header.type)) {
    return {
      publish: true,
      source: "type",
      reason: `\`${header.type}\` reaches consumers by default`,
    };
  }

  if (NON_PUBLISHING_TYPES.has(header.type)) {
    return {
      publish: false,
      source: "type",
      reason: `\`${header.type}\` does not reach consumers by default`,
    };
  }

  return {
    publish: undefined,
    source: "unknown",
    reason: `\`${header.type}\` is not a type this repository knows`,
  };
}

/**
 * Compare a title's intent with what the paths say.
 *
 * `agree` is the gate: the PR check fails on `false`, and the release run
 * refuses to guess rather than silently following one of the two.
 *
 * A title that cannot answer (`publish: undefined`) never disagrees — the paths
 * simply decide, which is what the fallback classes are for.
 *
 * @param {ReturnType<typeof classifyTitle>} title
 * @param {boolean} pathsPublish
 * @returns {{
 *   agree: boolean;
 *   publish: boolean;
 *   decidedBy: "title" | "paths";
 *   reason: string;
 * }}
 */
export function reconcile(title, pathsPublish) {
  if (title.publish === undefined) {
    return {
      agree: true,
      publish: pathsPublish,
      decidedBy: "paths",
      reason: `${title.reason}; the changed paths say ${pathsPublish ? "publish" : "skip"}`,
    };
  }

  if (title.publish === pathsPublish) {
    return {
      agree: true,
      publish: title.publish,
      decidedBy: "title",
      reason: `${title.reason}, and the changed paths agree`,
    };
  }

  return {
    agree: false,
    publish: title.publish,
    decidedBy: "title",
    reason: title.publish
      ? `${title.reason}, but nothing in the changed paths reaches a consumer — ` +
        "add [no-release] or retitle"
      : `${title.reason}, but the changed paths do reach a consumer — ` +
        "add [release] or retitle",
  };
}
