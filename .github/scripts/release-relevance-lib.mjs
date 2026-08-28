// @ts-check
/**
 * Release-relevance classification — pure functions, no git / no IO.
 *
 * Answers one question: can this set of changed files reach a PUBLISHED
 * package's tarball? Docs- and CI-only merges cannot, and must not produce a
 * release — no npm publish, no `chore(release):` bump, no tag, no GitHub
 * Release (#2931).
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
 * Can a change to `path` reach a published package's tarball?
 *
 * Note that `packages/**` is relevant WHOLESALE, Markdown included:
 * `@mittwald/flow-react-components` ships `AGENTS.md`, `MIGRATION.md` and
 * `USAGE.md` next to `dist`, so a package-local `.md` really can be part of the
 * published artifact. Only Markdown OUTSIDE `packages/` (root `README.md`,
 * `AGENTS.md`, `CHANGELOG.md`, …) is irrelevant.
 *
 * @param {string} path Repository-relative, forward-slash separated.
 * @returns {boolean}
 */
export function isPublishRelevant(path) {
  const p = path.trim();
  if (p === "") return false;

  if (IRRELEVANT_PREFIXES.some((prefix) => p.startsWith(prefix))) return false;

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
 * Root-`package.json` keys whose change cannot reach any tarball.
 *
 * Both are provably local: `scripts` is task wiring run by CI and by
 * developers, `simple-git-hooks` configures the local git hooks. Every other
 * key — the dependency blocks, `resolutions`, `packageManager`, `workspaces`,
 * `type`, `engines`, `version` — can move a built artifact or the toolchain
 * that produces it, and an UNKNOWN key is relevant like an unknown path is.
 */
const IRRELEVANT_ROOT_MANIFEST_KEYS = new Set(["scripts", "simple-git-hooks"]);

/**
 * Can a change to the root `package.json` reach a published tarball?
 *
 * The root manifest is private and never published, so nothing in it ships
 * directly — but its dependency and wiring keys shape what every package
 * builds. Only the key DIFF can tell the two apart, which is why the path-level
 * `isPublishRelevant` cannot: `scripts` churn (#2970 added `test:links` to two
 * scripts and cut 1.0.9) looks exactly like a `devDependencies` bump.
 *
 * Fails SAFE in both directions: unreadable or unparsable content is relevant,
 * and so is any key not on the denylist above.
 *
 * @param {string | null | undefined} beforeText
 * @param {string | null | undefined} afterText
 * @returns {{ relevant: boolean; reason: string }}
 */
export function classifyRootManifestChange(beforeText, afterText) {
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
      reason: "the root package.json could not be read (fail-safe default)",
    };
  }

  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changed = [...keys].filter(
    (key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]),
  );

  if (changed.length === 0) {
    return { relevant: false, reason: "the root package.json did not change" };
  }

  const relevantKeys = changed.filter(
    (key) => !IRRELEVANT_ROOT_MANIFEST_KEYS.has(key),
  );

  if (relevantKeys.length === 0) {
    return {
      relevant: false,
      reason: `the root package.json only changed ${changed.join(", ")}`,
    };
  }

  return {
    relevant: true,
    reason: `the root package.json changed ${relevantKeys.join(", ")}`,
  };
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
 * Two paths are refined beyond `isPublishRelevant`, because for them the path
 * alone carries no information (#2970, #2959):
 *
 * - **`package.json`** (root) — relevant only per `options.rootManifestRelevant`,
 *   which the caller derives from the key diff via
 *   `classifyRootManifestChange`. Unknown (`undefined`) stays relevant.
 * - **`pnpm-lock.yaml`** — a DERIVED file: it is relevant when the manifest that
 *   moved it is. So it follows the manifests in the same push, and drops out
 *   only when at least one manifest changed and none of them is relevant. A
 *   lockfile that changed with NO manifest (a dedupe, a resolution refresh)
 *   stays relevant — nothing in the path list explains it.
 *
 * @param {string[]} paths Changed files, repository-relative.
 * @param {{ rootManifestRelevant?: boolean }} [options]
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

  // The root manifest first: the lockfile rule below reads the REFINED
  // relevance of the manifests, not the path-level one.
  if (options.rootManifestRelevant === false) {
    relevant = relevant.filter((path) => path !== "package.json");
  }

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
