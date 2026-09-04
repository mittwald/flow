// @ts-check
/**
 * Release-relevance classification — pure functions, no git / no IO.
 *
 * Answers one question: can this set of changed files reach a CONSUMER of a
 * published package? Docs- and CI-only merges cannot, and must not produce a
 * release — no npm publish, no `chore(release):` bump, no tag, no GitHub
 * Release (#2931).
 *
 * The rule is a DENYLIST, and that direction is deliberate. Every published
 * package ships `dist` (plus a few top-level `.md`), so "what a consumer gets"
 * spans nearly all of `packages/**` — source, locales, SCSS, tsconfigs, vite
 * configs, generated code, build generators. An ALLOWLIST that forgets one of
 * those paths silently swallows a real release. A DENYLIST that forgets a new
 * docs directory merely publishes one needless version. So unknown paths are
 * RELEVANT, and only paths that provably cannot reach a consumer are listed
 * below.
 *
 * The criterion is CONSUMER EFFECT, not tarball membership. A tarball carries
 * `scripts` and a `.d.ts` per story and test file; no consumer installs,
 * imports or runs any of them.
 *
 * Relevance is decided by PATH, never by commit TYPE: `chore(deps):` and
 * `refactor:` routinely change what consumers resolve, so a type gate would
 * swallow real releases (#2931, #3023). What the changelog SAYS about those
 * releases is a separate axis — `lerna.json`'s `changelogPreset`, guarded by
 * `changelog-preset.test.mjs`.
 */

/**
 * Directory prefixes whose contents never reach a published tarball.
 *
 * - `.github/` — workflows, scripts, templates.
 * - `apps/` — docs site and remote-dom demo. Both are private and never
 *   published; no published package depends on them.
 * - `docs/` — repository docs and ADRs.
 * - `dev/` — preview-deployment tooling, run only by CI workflows.
 * - `.idea/`, `.vscode/`, `.claude/` — editor and agent configuration.
 */
const IRRELEVANT_PREFIXES = [
  ".github/",
  "apps/",
  "docs/",
  "dev/",
  ".idea/",
  ".vscode/",
  ".claude/",
];

/**
 * Root-level files that never reach a published tarball.
 *
 * Deliberately NOT here: `package.json`, `pnpm-lock.yaml`,
 * `pnpm-workspace.yaml`, `nx.json`, `lerna.json`, `eslint.config.js`,
 * `stylelint.config.mjs` and `patches/**` — a dependency, resolution or build
 * wiring change can move the built output, so those stay relevant.
 *
 * `package.json` and `pnpm-lock.yaml` are relevant only CONDITIONALLY, because
 * for those two the path alone says nothing (#2970, #2959). `isPublishRelevant`
 * still reports both as relevant — the refinement lives in
 * `classifyChangedFiles`, which sees the whole changed set and every changed
 * manifest's key diff.
 */
const IRRELEVANT_ROOT_FILES = new Set([
  "LICENSE",
  ".dockerignore",
  ".gitattributes",
  ".gitignore",
  ".prettierignore",
  ".prettierrc.json",
  ".stylelintignore",
]);

/**
 * Package-local directories whose contents cannot affect a consumer (#3023).
 *
 * Matched under `packages/<name>/`, segment-exact — `e2e-helpers/` is not
 * `e2e/`. Every published package ships `dist` plus a few top-level `.md` (the
 * `every published package ships …` test guards that), and none of these
 * directories is reachable from a build entry:
 *
 * - `.storybook/` — Storybook's own config. #3010 changed only
 *   `.storybook/preview.tsx` and cut 1.0.14.
 * - `e2e/` — the remote-test-server and cross-version harnesses.
 * - `src/tests/` — cross-package test sources, incl. the visual suite and its
 *   screenshot baselines.
 * - `dev/cross-version/`, `dev/vitest/` — the cross-version runner and the vitest
 *   setup files. #3006 changed `dev/cross-version/**`, `src/tests/visual/**`, a
 *   `CONTRIBUTE.md` and two npm scripts, and cut 1.0.12.
 *
 * `packages/*\/dev/` is deliberately NOT here wholesale, although #3023
 * proposed it: in `components` and `codemods` that directory IS the build.
 * `dev/vite/*` holds the PostCSS/rollup plugins `vite.build.config.ts` imports,
 * `dev/createDocPropertiesJson.ts` writes the shipped
 * `dist/assets/doc-properties.json`, `dev/remote-components-generator/**`
 * generates `view.ts` and `src/auto-generated/**`, and `codemods`' whole build
 * script is `tsx dev/generateCli.ts && …`. Denylisting `dev/` would swallow
 * those releases — the one failure mode this direction exists to prevent.
 */
const IRRELEVANT_PACKAGE_LOCAL_DIRS = [
  ".storybook",
  "e2e",
  "src/tests",
  "dev/cross-version",
  "dev/vitest",
];

/**
 * Package-local files that cannot affect a consumer.
 *
 * `CONTRIBUTE.md` is contributor documentation and no package lists it in
 * `files`; npm force-includes only `README`, `LICENSE` and `package.json`. The
 * shipped Markdown (`AGENTS.md`, `MIGRATION.md`, `USAGE.md`, `README.md`) stays
 * relevant — it really is part of the tarball.
 */
const IRRELEVANT_PACKAGE_LOCAL_FILES = new Set([
  "CONTRIBUTE.md",
  // The Storybook preview image, built by CI from `dev/` and `.github/`. #3008
  // pushed both of these and nothing else under `packages/`.
  "Dockerfile",
  ".dockerignore",
]);

/**
 * Filenames that cannot affect a consumer, wherever they sit.
 *
 * Stories and tests are never reachable from a build entry — the component
 * bundle is built from the explicit entry list in `vite.build.config.ts` with
 * `preserveModules`. `unplugin-dts` does emit a `.d.ts` for every file under
 * `src`, stories and tests included, so these DO land in the tarball; no
 * `exports` path reaches them, so no consumer can. Same argument as for
 * `scripts` in a manifest: no consumer effect, not "not in the tarball".
 *
 * `.test.` is not always the last extension — the remote e2e specs are
 * `*.browser.test.remote.tsx`.
 */
const IRRELEVANT_FILENAME_PATTERNS = [
  { label: "*.stories.tsx", pattern: /\.stories\.tsx$/ },
  { label: "*.test.*", pattern: /\.test\.[^/]+$/ },
];

/** The path below `packages/<name>/`, or `undefined` outside a package. */
function packageLocalPath(path) {
  const match = /^packages\/[^/]+\/(.+)$/.exec(path);
  return match?.[1];
}

/**
 * Can a change to `path` reach a consumer — and which rule decided?
 *
 * The `rule` is what the run's `::notice::` prints, so a skipped release says
 * WHY without anyone re-deriving it from the file list (#3023).
 *
 * Note that package-local Markdown is relevant unless listed above:
 * `@mittwald/flow-react-components` ships `AGENTS.md`, `MIGRATION.md` and
 * `USAGE.md` next to `dist`, so it really can be part of the published
 * artifact. Markdown OUTSIDE `packages/` (root `README.md`, `AGENTS.md`,
 * `CHANGELOG.md`, …) is irrelevant.
 *
 * @param {string} path Repository-relative, forward-slash separated.
 * @returns {{ relevant: boolean; rule: string }}
 */
export function classifyPath(path) {
  const p = path.trim();
  if (p === "") return { relevant: false, rule: "empty path" };

  const prefix = IRRELEVANT_PREFIXES.find((candidate) =>
    p.startsWith(candidate),
  );
  if (prefix) return { relevant: false, rule: `top-level "${prefix}"` };

  const filename = IRRELEVANT_FILENAME_PATTERNS.find(({ pattern }) =>
    pattern.test(p),
  );
  if (filename)
    return { relevant: false, rule: `filename "${filename.label}"` };

  if (!p.includes("/")) {
    if (IRRELEVANT_ROOT_FILES.has(p)) {
      return { relevant: false, rule: `root file "${p}"` };
    }
    if (p.endsWith(".md")) return { relevant: false, rule: "root Markdown" };
    return { relevant: true, rule: "not provably non-shipping" };
  }

  const local = packageLocalPath(p);
  if (local !== undefined) {
    const dir = IRRELEVANT_PACKAGE_LOCAL_DIRS.find((candidate) =>
      local.startsWith(`${candidate}/`),
    );
    if (dir) {
      return { relevant: false, rule: `package-local "packages/*/${dir}/"` };
    }
    if (IRRELEVANT_PACKAGE_LOCAL_FILES.has(local)) {
      return { relevant: false, rule: `package-local "packages/*/${local}"` };
    }
  }

  return { relevant: true, rule: "not provably non-shipping" };
}

/**
 * Can a change to `path` reach a consumer?
 *
 * @param {string} path Repository-relative, forward-slash separated.
 * @returns {boolean}
 */
export function isPublishRelevant(path) {
  return classifyPath(path).relevant;
}

/**
 * Could `line` be a repository path the compare API produced?
 *
 * `gh api` prints the error BODY to stdout on a non-2xx response, so a failed
 * call can hand us a JSON blob. Mistaking one for a filename would classify it
 * silently — as publishable, or worse, as not.
 *
 * Only `{`, `}` and `"` are rejected: no tracked path contains them, while
 * square brackets are legitimate (`apps/docs/src/app/[...slug]/page.tsx`).
 *
 * @param {string} line
 * @returns {boolean}
 */
function looksLikePath(line) {
  return !/["{}]/.test(line);
}

/**
 * Manifest keys whose change cannot reach a consumer.
 *
 * Both are provably local: `scripts` is task wiring run by CI and by
 * developers, `simple-git-hooks` configures the local git hooks. Every other
 * key — the dependency blocks, `resolutions`, `packageManager`, `workspaces`,
 * `files`, `exports`, `type`, `engines`, `version` — can move a built artifact,
 * the toolchain that produces it, or what a consumer resolves; an UNKNOWN key
 * is relevant like an unknown path is.
 *
 * A published tarball DOES contain `scripts` — npm strips nothing but a few
 * lifecycle-adjacent fields. The argument is "no consumer effect", not "not in
 * the tarball": nothing a consumer installs, imports or runs reads a Flow
 * package's `test:unit` or `build` script. Same reasoning as for the story and
 * test `.d.ts` files above.
 */
const IRRELEVANT_MANIFEST_KEYS = new Set(["scripts", "simple-git-hooks"]);

/**
 * Can a change to a `package.json` reach a consumer?
 *
 * Applies to the ROOT manifest and to every `packages/*\/package.json` (#3023).
 * The root manifest is private and never published, so nothing in it ships
 * directly — but its dependency and wiring keys shape what every package
 * builds. A package manifest ships whole. Either way only the key DIFF can tell
 * the two cases apart, which is why the path-level `classifyPath` cannot:
 * `scripts` churn (#2970 added `test:links` to two root scripts and cut 1.0.9;
 * #3006 changed one package's `test:unit` and cut 1.0.12) looks exactly like a
 * dependency bump.
 *
 * Fails SAFE in both directions: unreadable or unparsable content is relevant,
 * and so is any key not on the denylist above.
 *
 * @param {string | null | undefined} beforeText
 * @param {string | null | undefined} afterText
 * @param {string} [path] The manifest's repository-relative path, for the
 *   reason.
 * @returns {{ relevant: boolean; reason: string }}
 */
export function classifyManifestChange(
  beforeText,
  afterText,
  path = "package.json",
) {
  const label = path === "package.json" ? "the root package.json" : path;
  /** @param {string | null | undefined} text */
  const parse = (text) => {
    if (typeof text !== "string") return undefined;
    try {
      const value = JSON.parse(text);
      return value !== null && typeof value === "object" ? value : undefined;
    } catch {
      return undefined;
    }
  };

  const before = parse(beforeText);
  const after = parse(afterText);

  if (!before || !after) {
    return {
      relevant: true,
      reason: `${label} could not be read (fail-safe default)`,
    };
  }

  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changed = [...keys].filter(
    (key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]),
  );

  if (changed.length === 0) {
    return { relevant: false, reason: `${label} did not change` };
  }

  const relevantKeys = changed.filter(
    (key) => !IRRELEVANT_MANIFEST_KEYS.has(key),
  );

  if (relevantKeys.length === 0) {
    return {
      relevant: false,
      reason: `${label} only changed ${changed.join(", ")}`,
    };
  }

  return {
    relevant: true,
    reason: `${label} changed ${relevantKeys.join(", ")}`,
  };
}

/**
 * The package directory and filename of a package-root Markdown file.
 *
 * Only the root level: `packages/codemods/src/migrations/x/entry.md` is a
 * generator INPUT, not documentation, so it must keep its path-level
 * relevance.
 *
 * @param {string} path
 * @returns {{ dir: string; file: string } | undefined}
 */
export function packageRootMarkdown(path) {
  const match = /^(packages\/[^/]+)\/([^/]+\.md)$/.exec(path);
  return match ? { dir: match[1], file: match[2] } : undefined;
}

/**
 * Does a package's `files` list ship this root Markdown file?
 *
 * `files` is the whole truth for a root-level `.md`: nothing builds one, so it
 * reaches a consumer exactly if it is published. `flow-react-components` lists
 * `AGENTS.md`, `MIGRATION.md` and `USAGE.md`; `remote-react-components` lists
 * only `USAGE.md`, so ITS `AGENTS.md` reaches nobody.
 *
 * Fails SAFE: an unknown `files` (the caller could not read the manifest)
 * counts as shipped.
 *
 * @param {string} file
 * @param {string[] | undefined} files
 * @returns {boolean}
 */
export function shipsRootMarkdown(file, files) {
  if (!Array.isArray(files)) return true;
  return files.some((entry) => {
    const normalized = entry.replace(/^\.\//, "");
    if (normalized === file) return true;
    // npm honours a `*.md`-style glob at the root of `files`.
    if (normalized.startsWith("*.")) return file.endsWith(normalized.slice(1));
    return false;
  });
}

/** Does `path` name a package manifest? */
function isManifest(path) {
  return path === "package.json" || path.endsWith("/package.json");
}

/**
 * Decide whether a push publishes.
 *
 * Fails SAFE: an empty file list means we could not determine what changed
 * (unreachable `before` sha, a force push, a compare response we could not
 * read), and the answer is then "publish" — the behaviour before #2931.
 *
 * Two kinds of path are refined beyond `classifyPath`, because for them the
 * path alone carries no information (#2970, #2959, #3023):
 *
 * - **every `package.json`** — the root one and each `packages/*\/package.json` —
 *   relevant only per `options.manifestRelevance[path]`, which the caller
 *   derives from the key diff via `classifyManifestChange`. Unknown
 *   (`undefined`) stays relevant.
 * - **`pnpm-lock.yaml`** — a DERIVED file: it is relevant when the manifest that
 *   moved it is. So it follows the manifests in the same push, and drops out
 *   only when at least one manifest changed and none of them is relevant. A
 *   lockfile that changed with NO manifest (a dedupe, a resolution refresh)
 *   stays relevant — nothing in the path list explains it.
 *
 * `rules` lists, deduplicated and sorted, which rule decided each irrelevant
 * file. The guard prints it, so a skipped release names the rule that fired.
 *
 * @param {string[]} paths Changed files, repository-relative.
 * @param {{
 *   manifestRelevance?: Record<string, boolean | undefined>;
 *   packageFiles?: Record<string, string[] | undefined>;
 * }} [options]
 * @returns {{
 *   publish: boolean;
 *   reason: string;
 *   relevant: string[];
 *   rules: string[];
 *   total: number;
 * }}
 */
export function classifyChangedFiles(paths, options = {}) {
  const files = paths.map((p) => p.trim()).filter((p) => p !== "");

  if (!files.every(looksLikePath)) {
    return {
      publish: true,
      reason:
        "the changed-file list is not a list of paths (fail-safe default)",
      relevant: [],
      rules: [],
      total: files.length,
    };
  }

  if (files.length === 0) {
    return {
      publish: true,
      reason: "no changed files could be determined (fail-safe default)",
      relevant: [],
      rules: [],
      total: 0,
    };
  }

  const manifestRelevance = options.manifestRelevance ?? {};
  const rules = new Set();

  let relevant = files.filter((path) => {
    const { relevant: isRelevant, rule } = classifyPath(path);
    if (!isRelevant) rules.add(rule);
    return isRelevant;
  });

  // A package-root Markdown file reaches a consumer exactly if that package
  // publishes it, which only its `files` can say (#3023).
  const packageFiles = options.packageFiles ?? {};
  relevant = relevant.filter((path) => {
    const markdown = packageRootMarkdown(path);
    if (!markdown) return true;
    if (shipsRootMarkdown(markdown.file, packageFiles[markdown.dir])) {
      return true;
    }
    rules.add(`package Markdown outside "files"`);
    return false;
  });

  // The manifests next: the lockfile rule below reads their REFINED relevance,
  // not the path-level one.
  relevant = relevant.filter((path) => {
    if (!isManifest(path) || manifestRelevance[path] !== false) return true;
    rules.add(`manifest key diff "${path}"`);
    return false;
  });

  const manifests = files.filter(isManifest);
  const relevantManifests = manifests.filter((path) => relevant.includes(path));
  if (manifests.length > 0 && relevantManifests.length === 0) {
    if (relevant.includes("pnpm-lock.yaml")) {
      rules.add("derived lockfile follows its manifests");
    }
    relevant = relevant.filter((path) => path !== "pnpm-lock.yaml");
  }

  const firedRules = [...rules].sort();

  if (relevant.length === 0) {
    return {
      publish: false,
      reason:
        `all ${files.length} changed file(s) are non-shipping — ` +
        `rules: ${firedRules.join("; ")}`,
      relevant,
      rules: firedRules,
      total: files.length,
    };
  }

  return {
    publish: true,
    reason: `${relevant.length} of ${files.length} changed file(s) affect published packages`,
    relevant,
    rules: firedRules,
    total: files.length,
  };
}
