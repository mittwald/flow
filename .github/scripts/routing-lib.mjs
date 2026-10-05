// @ts-check
/**
 * Release-line routing — pure functions, no git / no IO.
 *
 * `main` takes fix:/docs:/chore:/…, `next` additionally takes feat:, and a
 * breaking change belongs on the major line. Called from `routing-guard.mjs` in
 * `commit-guard.yml`.
 *
 * The PR title alone is not enough. A merge commit brings every branch commit
 * onto the line, and lerna-lite reads all of them. #3290 was titled
 * `fix(CodeBlock): …`, carried `feat(CodeBlock): animate showing more and
 * less`, was merged as a merge commit and released `main` as 1.3.0; #3166 did
 * the same on `next` with a `!` commit and opened `2.0.0-next.0` (#3199). The
 * merge method is not known while the PR is open, `main` has to allow merge
 * commits for the promotion PR and `next` allows only those, so the commits are
 * checked whatever the PR will be merged with.
 *
 * The patterns follow what lerna actually parses (`conventional-commits-parser`
 * with the `conventionalcommits` preset), not what the guard would like to see:
 * a narrower regex is a commit that passes here and still bumps there.
 */

/**
 * Heads that are supposed to carry feat:/breaking commits (ADR 0004 §8): a
 * promotion (`next`, `release/x.y.0`, a major line) or a sync PR. Only a branch
 * of this repository counts — a fork's `next` or a feature branch someone named
 * `release/…` elsewhere is an ordinary PR.
 *
 * @param {{ headRef: string; headRepo: string; repo: string }} pr
 */
export const isExemptPr = ({ headRef, headRepo, repo }) =>
  headRepo === repo &&
  (headRef === "next" ||
    /^([0-9]+\.(x|[0-9]+)|next-major)$/.test(headRef) ||
    /^(sync|release)\//.test(headRef));

/**
 * The standing lines (RFC #2711), the only bases that reject a breaking change.
 * A major line (`2.x`) exists to take one, and opening it per the major-line
 * runbook makes this guard run for it too.
 *
 * @param {string} baseRef
 */
export const isStandingLine = (baseRef) =>
  baseRef === "main" || baseRef === "next";

/**
 * Classify one conventional-commit message (header plus body/footers).
 *
 * - `feature` is a minor too: the preset's `whatBump` checks `type === 'feat' ||
 *   type === 'feature'`.
 * - Breaking mirrors the parser: `breakingHeaderPattern` `^(\w*)(?:\((.*)\))?!:
 *   (.*)$` (any case, any scope) and the notes pattern `^(?:\*\s+)?(BREAKING
 *   CHANGE|BREAKING-CHANGE):` with flag `i`.
 *
 * @param {string} message
 * @returns {{ isFeat: boolean; isBreaking: boolean }}
 */
export const classifyMessage = (message) => {
  const header = message.split("\n", 1)[0] ?? "";
  return {
    isFeat: /^feat(ure)?(\(.*\))?!?:/i.test(header),
    isBreaking:
      /^\w*(\(.*\))?!:/.test(header) ||
      /^[ \t]*(?:\*\s+)?BREAKING[- ]CHANGE:/im.test(message),
  };
};

/**
 * @typedef {{ sha: string; message: string }} Commit
 * @param {{
 *   baseRef: string;
 *   headRef: string;
 *   headRepo: string;
 *   repo: string;
 *   title: string;
 *   body: string;
 *   commits: Commit[];
 * }} pr
 * @returns {string[]} One error per violation; empty means routing is OK.
 */
export const routingErrors = ({
  baseRef,
  headRef,
  headRepo,
  repo,
  title,
  body,
  commits,
}) => {
  if (isExemptPr({ headRef, headRepo, repo })) return [];

  /** @type {string[]} */
  const errors = [];
  // The body never reaches a commit (squash and merge messages are blank), so
  // it keeps the strict, case-sensitive footer: the parser's wide one would
  // only fail a description line like "Breaking change: none".
  const pr = classifyMessage(title);
  const bodyIsBreaking = /^[ \t]*BREAKING[- ]CHANGE:/m.test(body);
  const standing = isStandingLine(baseRef);

  if (standing && (pr.isBreaking || bodyIsBreaking)) {
    errors.push(
      `PR marks a breaking change — breaking changes target the major line, not '${baseRef}'.`,
    );
  }
  if (baseRef === "main" && pr.isFeat) {
    errors.push("PR title is a 'feat' — features target 'next', not 'main'.");
  }

  for (const { sha, message } of commits) {
    const commit = classifyMessage(message);
    const header = message.split("\n", 1)[0];
    if (standing && commit.isBreaking) {
      errors.push(
        `Commit ${sha} marks a breaking change ("${header}") — a merge commit brings it onto '${baseRef}', and breaking changes target the major line. Reword it or squash the branch locally.`,
      );
    } else if (baseRef === "main" && commit.isFeat) {
      errors.push(
        `Commit ${sha} is a 'feat' ("${header}") — a merge commit brings it onto 'main', and features target 'next'. Reword it, squash the branch locally, or target 'next'.`,
      );
    }
  }

  return errors;
};
