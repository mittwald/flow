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
 * package ships `dist` (plus `*.md` for flow-react-components), so "what ends
 * up in a tarball" spans nearly all of `packages/**` — source, locales, SCSS,
 * tsconfigs, vite configs, generated code. An ALLOWLIST that forgets one of
 * those paths silently swallows a real release. A DENYLIST that forgets a new
 * docs directory merely publishes one needless version — exactly what happens
 * today. So unknown paths are RELEVANT, and only paths that provably cannot
 * reach a tarball are listed below.
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
 * `@mittwald/flow-react-components` ships `["*.md", "dist"]`, so a
 * package-local `.md` really is part of the published artifact. Only Markdown
 * OUTSIDE `packages/` (root `README.md`, `AGENTS.md`, `CHANGELOG.md`, …) is
 * irrelevant.
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
 * Decide whether a push publishes.
 *
 * Fails SAFE: an empty file list means we could not determine what changed
 * (unreachable `before` sha, a force push, a compare response we could not
 * read), and the answer is then "publish" — the behaviour before #2931.
 *
 * @param {string[]} paths Changed files, repository-relative.
 * @returns {{
 *   publish: boolean;
 *   reason: string;
 *   relevant: string[];
 *   total: number;
 * }}
 */
export function classifyChangedFiles(paths) {
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

  const relevant = files.filter(isPublishRelevant);

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
