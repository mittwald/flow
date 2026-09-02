// @ts-check
/**
 * Release-relevance classification — pure functions, no git / no IO.
 *
 * Answers one question: can this set of changed files change what a CONSUMER of
 * a published package gets? Docs- and CI-only merges cannot, and must not
 * produce a release — no npm publish, no `chore(release):` bump, no tag, no
 * GitHub Release (#2931).
 *
 * "Consumer effect", not "inside the tarball" — the two are not the same, and
 * the difference decides two whole classes (#3023). A published tarball carries
 * the package's `scripts`, yet only the install lifecycle ones ever run on a
 * consumer's machine. And `dist/types` is emitted from all of `src`, which used
 * to drag test and story declarations along — 196 of `flow-remote-react-`
 * `components@1.1.10`'s 799 entries were `dist/types/tests/**`, dead files no
 * `exports` path can reach. The build excludes them now, but the criterion has
 * to be consumer effect either way: nothing stops the next generator from
 * emitting something similar.
 *
 * The rule is a DENYLIST, and that direction is deliberate. Every published
 * package ships `dist` (plus three `.md` for flow-react-components), so "what
 * ends up in a tarball" spans nearly all of `packages/**` — source, locales,
 * SCSS, tsconfigs, vite configs, generated code. An ALLOWLIST that forgets one
 * of those paths silently swallows a real release. A DENYLIST that forgets a
 * new docs directory merely publishes one needless version — exactly what
 * happens today. So unknown paths are RELEVANT, and only paths that provably
 * cannot reach a tarball are listed below.
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
 * `classifyChangedFiles`, which sees the whole changed set and the root
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
 * Package-local paths with no consumer effect.
 *
 * `packages/**` is relevant WHOLESALE for a reason (see `isPublishRelevant`),
 * so this list holds only what provably cannot change what a consumer gets:
 *
 * - `.storybook/` — the component dev environment (`nx dev components`). No build
 *   or generator reads it; the only mentions elsewhere are comments.
 * - `Dockerfile` / `.dockerignore` — the Storybook preview image, which CI builds
 *   from `dev/` and `.github/`.
 * - `e2e/` and `src/tests/` — test suites. They are not build entries, and the
 *   declarations `dist/types` used to emit for them are excluded now.
 * - `*.stories.*` and `*.test.*` anywhere in a package — same argument, for the
 *   files that sit next to the code they exercise. No production module imports
 *   a story or a test.
 *
 * Deliberately NOT here, though #3023 proposed it: a package's own `dev/`
 * directory. It is a BUILD INPUT, not tooling. `components/dev/vite/*` is
 * imported by `vite.build.config.ts` and shapes the emitted CSS layers,
 * `dev/component-index` and `dev/status-registry` generate shipped `dist`
 * assets, and `codemods/dev/generate` writes `MIGRATION.md` — which
 * `flow-react-components` publishes. Skipping it would swallow real releases.
 *
 * Nor is a `stories/` or `testData/` DIRECTORY skipped, only the story and test
 * files themselves. `components/dev/createDocPropertiesJson.ts` parses every
 * `.tsx` under `src/` and ignores only `*.stories.tsx`, so the helper beside a
 * story — `components/Button/stories/lib.tsx` — contributes five entries to the
 * published `dist/assets/doc-properties.json`. `packages/core`'s
 * `publishedDtsOptions` draws the same line for the declaration emit; keep the
 * two in step.
 *
 * Also not here: a package's non-shipped Markdown (`CONTRIBUTE.md` and
 * friends). Each package's `files` differs — `flow-react-components` publishes
 * three `.md` — so that decision needs the manifest, not the path.
 */
const IRRELEVANT_PACKAGE_PATTERNS = [
  /^packages\/[^/]+\/\.storybook\//,
  /^packages\/[^/]+\/Dockerfile$/,
  /^packages\/[^/]+\/\.dockerignore$/,
  /^packages\/[^/]+\/e2e\//,
  /^packages\/[^/]+\/src\/tests\//,
  /^packages\/.*\.stories\.[^/]+$/,
  /^packages\/.*\.test\.[^/]+$/,
];

/**
 * Can a change to `path` change what a consumer gets?
 *
 * Note that `packages/**` is relevant WHOLESALE, Markdown included:
 * `@mittwald/flow-react-components` ships `AGENTS.md`, `MIGRATION.md` and
 * `USAGE.md` next to `dist`, so a package-local `.md` really can be part of the
 * published artifact. Only Markdown OUTSIDE `packages/` (root `README.md`,
 * `AGENTS.md`, `CHANGELOG.md`, …) is irrelevant. The only carve-outs are the
 * narrow, provable ones in `IRRELEVANT_PACKAGE_PATTERNS` above.
 *
 * @param {string} path Repository-relative, forward-slash separated.
 * @returns {boolean}
 */
export function isPublishRelevant(path) {
  const p = path.trim();
  if (p === "") return false;

  if (IRRELEVANT_PREFIXES.some((prefix) => p.startsWith(prefix))) return false;
  if (IRRELEVANT_PACKAGE_PATTERNS.some((re) => re.test(p))) return false;

  const isRootFile = !p.includes("/");
  if (isRootFile && (IRRELEVANT_ROOT_FILES.has(p) || p.endsWith(".md"))) {
    return false;
  }

  return true;
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
 * Root-`package.json` keys whose change cannot reach a consumer.
 *
 * Both are provably local: `scripts` is task wiring run by CI and by
 * developers, `simple-git-hooks` configures the local git hooks. Every other
 * key — the dependency blocks, `resolutions`, `packageManager`, `workspaces`,
 * `type`, `engines`, `version` — can move a built artifact or the toolchain
 * that produces it, and an UNKNOWN key is relevant like an unknown path is.
 */
const IRRELEVANT_ROOT_MANIFEST_KEYS = new Set(["scripts", "simple-git-hooks"]);

/**
 * A published package's manifest keys whose change cannot reach a consumer.
 *
 * Only `scripts` — and only conditionally. The tarball DOES carry it, but a
 * consumer never runs `build` or `test` from a dependency; the install
 * lifecycle is the exception, and `SCRIPTS_A_CONSUMER_RUNS` guards it. No Flow
 * package defines one of those today, which is exactly why the guard has to be
 * in the code rather than in someone's memory.
 *
 * Everything else stays relevant: the dependency blocks and `peerDependencies`
 * decide what a consumer resolves, `exports` / `main` / `types` / `files` /
 * `sideEffects` / `bin` / `type` decide what they can import, and `version` is
 * the release itself.
 */
const IRRELEVANT_PACKAGE_MANIFEST_KEYS = new Set(["scripts"]);

/** Script names npm runs when a consumer installs the package. */
const SCRIPTS_A_CONSUMER_RUNS = [
  "preinstall",
  "install",
  "postinstall",
  "prepare",
];

/**
 * Did the `scripts` diff touch anything a consumer's install would run?
 *
 * @param {Record<string, unknown>} before
 * @param {Record<string, unknown>} after
 * @returns {boolean}
 */
function scriptsReachAConsumer(before, after) {
  const b = /** @type {Record<string, unknown>} */ (before.scripts ?? {});
  const a = /** @type {Record<string, unknown>} */ (after.scripts ?? {});
  return SCRIPTS_A_CONSUMER_RUNS.some((name) => b[name] !== a[name]);
}

/**
 * Judge a manifest by its KEY DIFF instead of its path.
 *
 * Fails SAFE in both directions: unreadable or unparsable content is relevant,
 * and so is any key not on the given denylist.
 *
 * @param {string | null | undefined} beforeText
 * @param {string | null | undefined} afterText
 * @param {{
 *   label: string;
 *   irrelevantKeys: Set<string>;
 *   stillRelevant?: (
 *     key: string,
 *     before: Record<string, unknown>,
 *     after: Record<string, unknown>,
 *   ) => boolean;
 * }} options
 * @returns {{ relevant: boolean; reason: string }}
 */
function classifyManifestChange(beforeText, afterText, options) {
  const { label, irrelevantKeys, stillRelevant } = options;

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
    (key) =>
      !irrelevantKeys.has(key) ||
      (stillRelevant?.(key, before, after) ?? false),
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
 * Can a change to the root `package.json` reach a consumer?
 *
 * The root manifest is private and never published, so nothing in it ships
 * directly — but its dependency and wiring keys shape what every package
 * builds. Only the key DIFF can tell the two apart, which is why the path-level
 * `isPublishRelevant` cannot: `scripts` churn (#2970 added `test:links` to two
 * scripts and cut 1.0.9) looks exactly like a `devDependencies` bump.
 *
 * @param {string | null | undefined} beforeText
 * @param {string | null | undefined} afterText
 * @returns {{ relevant: boolean; reason: string }}
 */
export function classifyRootManifestChange(beforeText, afterText) {
  return classifyManifestChange(beforeText, afterText, {
    label: "the root package.json",
    irrelevantKeys: IRRELEVANT_ROOT_MANIFEST_KEYS,
  });
}

/**
 * Can a change to a PACKAGE's `package.json` reach a consumer?
 *
 * Same reasoning as the root manifest, one level down (#3023): #3006 edited
 * `remote-react-components`' `scripts` (a `--project=unit` glob) and cut 1.0.12
 * with an empty changelog.
 *
 * @param {string | null | undefined} beforeText
 * @param {string | null | undefined} afterText
 * @param {string} [path] Named in the reason, so a run says WHICH manifest.
 * @returns {{ relevant: boolean; reason: string }}
 */
export function classifyPackageManifestChange(
  beforeText,
  afterText,
  path = "a package.json",
) {
  return classifyManifestChange(beforeText, afterText, {
    label: path,
    irrelevantKeys: IRRELEVANT_PACKAGE_MANIFEST_KEYS,
    stillRelevant: (key, before, after) =>
      key === "scripts" && scriptsReachAConsumer(before, after),
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
 * Two kinds of path are refined beyond `isPublishRelevant`, because for them
 * the path alone carries no information (#2970, #2959, #3023):
 *
 * - **every `package.json`** — relevant per `options.manifestRelevance[path]`,
 *   which the caller derives from that manifest's key diff via
 *   `classifyRootManifestChange` / `classifyPackageManifestChange`. Unknown
 *   (missing or `undefined`) stays relevant.
 * - **`pnpm-lock.yaml`** — a DERIVED file: it is relevant when the manifest that
 *   moved it is. So it follows the manifests in the same push, and drops out
 *   only when at least one manifest changed and none of them is relevant. A
 *   lockfile that changed with NO manifest (a dedupe, a resolution refresh)
 *   stays relevant — nothing in the path list explains it.
 *
 * @param {string[]} paths Changed files, repository-relative.
 * @param {{ manifestRelevance?: Record<string, boolean | undefined> }} [options]
 * @returns {{
 *   publish: boolean;
 *   reason: string;
 *   relevant: string[];
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
      total: files.length,
    };
  }

  if (files.length === 0) {
    return {
      publish: true,
      reason: "no changed files could be determined (fail-safe default)",
      relevant: [],
      total: 0,
    };
  }

  let relevant = files.filter(isPublishRelevant);

  // The manifests first: the lockfile rule below reads their REFINED relevance,
  // not the path-level one.
  const manifestRelevance = options.manifestRelevance ?? {};
  relevant = relevant.filter(
    (path) => !isManifest(path) || manifestRelevance[path] !== false,
  );

  const manifests = files.filter(isManifest);
  const relevantManifests = manifests.filter((path) => relevant.includes(path));
  if (manifests.length > 0 && relevantManifests.length === 0) {
    relevant = relevant.filter((path) => path !== "pnpm-lock.yaml");
  }

  if (relevant.length === 0) {
    return {
      publish: false,
      reason: `all ${files.length} changed file(s) are docs/CI/tooling only — nothing reaches a published package`,
      relevant,
      total: files.length,
    };
  }

  return {
    publish: true,
    reason: `${relevant.length} of ${files.length} changed file(s) affect published packages`,
    relevant,
    total: files.length,
  };
}
