// @ts-check
/**
 * Closing-reference parsing for pull requests that land on a standing line
 * other than the default branch — pure functions, no git / no IO.
 *
 * GitHub resolves `Closes #123` only when the change reaches the DEFAULT
 * branch: from the pull request body when the PR merges into it, and from a
 * commit message when that commit is pushed to it. `main` is the default branch
 * here, so a PR merged into `next` closes nothing — the keyword is read, the
 * link is even displayed, and then nothing happens. Closing was left to whoever
 * remembered (#3214, #3134, #3165, #2777, #2867 were all closed by hand, #3189
 * and #3059 were not).
 *
 * The contract these functions serve: **a PR merged into `next` closes exactly
 * what the same PR merged into `main` would have closed.** That is why both
 * sources are parsed — the body (GitHub's linked-issue path) and the PR's own
 * commits (GitHub's push-to-default-branch path). `next` takes true merges, so
 * the branch commits really do enter its history, which makes the second source
 * the faithful half rather than a nicety.
 *
 * Deliberately NOT a superset of GitHub's behaviour: a reference to another
 * repository is reported separately and never acted on, and text inside code
 * fences and inline code is stripped first. Both are conservative — this code
 * closes issues without a human in the loop, so an ambiguity resolves to "leave
 * it open".
 */

/**
 * The keywords GitHub treats as closing. Any other verb — `part of`, `see`,
 * `related to`, `for` — is a plain reference and stays one here.
 *
 * @see https://docs.github.com/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue
 */
const CLOSING_KEYWORDS = [
  "close",
  "closes",
  "closed",
  "fix",
  "fixes",
  "fixed",
  "resolve",
  "resolves",
  "resolved",
];

/**
 * A closing keyword followed by one of the three reference notations GitHub
 * accepts: `#123`, `GH-123`, or `owner/repo#123`.
 *
 * The separator is `\s*:?\s+` because `Fixes: #123` is as common in this repo's
 * PR bodies as `Fixes #123`, and GitHub resolves both.
 */
const CLOSING_REFERENCE = new RegExp(
  String.raw`\b(?:${CLOSING_KEYWORDS.join("|")})\b\s*:?\s+` +
    String.raw`(?:(?<owner>[\w.-]+)\/(?<repo>[\w.-]+)#|#|GH-)(?<number>\d+)\b`,
  "gi",
);

/** Opening or closing line of a fenced code block. */
const FENCE = /^[ \t]*(`{3,}|~{3,})/;

/**
 * Removes fenced code blocks and inline code spans.
 *
 * GitHub itself resolves references inside code, which is the one place this
 * parser is deliberately stricter. The PR bodies here routinely quote diffs,
 * shell transcripts and other issues' text verbatim — #3199's body alone
 * carries a `gh api` line and two quoted `grep` patterns — and a quoted `Closes
 * #123` must not close #123.
 *
 * An unterminated fence swallows the rest of the text. That is the conservative
 * direction: the failure is a missed close, not a wrong one.
 *
 * @param {string} text
 * @returns {string}
 * @internal
 */
const stripCode = (text) => {
  /** @type {string[]} */
  const kept = [];
  /** @type {string | null} */
  let openFence = null;

  for (const line of text.split("\n")) {
    const fence = FENCE.exec(line)?.[1];

    if (openFence !== null) {
      // A closing fence is at least as long as the one that opened the block,
      // so `startsWith` is the length check as well.
      if (fence !== undefined && line.trimStart().startsWith(openFence)) {
        openFence = null;
      }
      continue;
    }

    if (fence !== undefined) {
      openFence = fence;
      continue;
    }

    // Inline code leaves a marker behind rather than being removed or turned
    // into whitespace. Either of those would let a keyword reach a number that
    // was only ever separated from it by code — `Closes `the ticket` #999`
    // would start closing #999. The marker holds no digits and no keyword, so
    // it cannot create a reference of its own.
    kept.push(line.replace(/`[^`]*`/g, "<code>"));
  }

  return kept.join("\n");
};

/**
 * @typedef {object} ClosingReferences
 * @property {number[]} own Issue numbers in `repo`, in order of appearance,
 *   deduplicated.
 * @property {string[]} foreign `owner/repo#number` references to other
 *   repositories — reported so the run can say what it ignored, never closed.
 */

/**
 * Parses one text for closing references.
 *
 * @param {string | null | undefined} text
 * @param {string} repo `owner/name` of the repository whose issues may be
 *   closed. Compared case-insensitively, as GitHub treats these names.
 * @returns {ClosingReferences}
 */
export const parseClosingReferences = (text, repo) => {
  /** @type {Set<number>} */
  const own = new Set();
  /** @type {Set<string>} */
  const foreign = new Set();

  if (!text) {
    return { own: [], foreign: [] };
  }

  for (const match of stripCode(text).matchAll(CLOSING_REFERENCE)) {
    const { owner, repo: name, number } = match.groups ?? {};
    const qualified = owner && name ? `${owner}/${name}` : null;

    if (qualified && qualified.toLowerCase() !== repo.toLowerCase()) {
      foreign.add(`${qualified}#${number}`);
      continue;
    }

    own.add(Number(number));
  }

  return { own: [...own], foreign: [...foreign] };
};

/**
 * Collects the closing references of a whole pull request: its body plus each
 * of its commits.
 *
 * `/pulls/{n}/commits` returns only the commits that are not already on the
 * base branch, so a feature branch that merged `next` into itself does not drag
 * other pull requests' closing keywords along.
 *
 * @param {object} pr
 * @param {string | null | undefined} pr.body
 * @param {readonly string[]} [pr.commitMessages]
 * @param {string} pr.repo
 * @returns {ClosingReferences}
 */
export const collectClosingReferences = ({
  body,
  commitMessages = [],
  repo,
}) => {
  /** @type {Set<number>} */
  const own = new Set();
  /** @type {Set<string>} */
  const foreign = new Set();

  for (const text of [body, ...commitMessages]) {
    const references = parseClosingReferences(text, repo);
    references.own.forEach((number) => own.add(number));
    references.foreign.forEach((reference) => foreign.add(reference));
  }

  return { own: [...own], foreign: [...foreign] };
};
