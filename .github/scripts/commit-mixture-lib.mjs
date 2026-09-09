// @ts-check
/**
 * Commit-mixture classification — pure functions, no git / no IO.
 *
 * The repo squash-merges, so only the PR TITLE survives the merge: it becomes
 * the release commit Lerna-Lite reads, and `commit-guard.yml`'s routing job
 * checks that title against the target branch. A PR whose commits carry a
 * higher release class than its title therefore smuggles that class past
 * routing — a `feat:` commit under a `fix:` title lands a feature on `main`,
 * and a breaking commit under either lands it on a standing line.
 *
 * Two rules, both about the classes a PR mixes:
 *
 * 1. At most ONE releasing class per PR. `feat` + `fix` cannot both be told in one
 *    squash subject, and they route to different branches.
 * 2. The title's class equals the commits' class. Anything else is either
 *    smuggling (title lower) or mislabelling (title higher).
 *
 * Non-releasing commits mix freely: a feature with its docs, a fix with its
 * test. And a commit whose subject is not a Conventional Commit is IGNORED —
 * `wip`, `review feedback` and `fixup!` are normal on a branch, and failing on
 * them would make the guard a nuisance rather than a gate.
 */

/** Release classes, ordered. `none` never conflicts with anything. */
const CLASS_ORDER = ["none", "patch", "feature", "breaking"];

/** Types that produce a patch release. */
const PATCH_TYPES = new Set(["fix", "perf", "revert"]);

/** Types that produce a feature release. */
const FEATURE_TYPES = new Set(["feat", "feature"]);

/** Types that release nothing. Keep in step with `commit-guard.yml`. */
const NONE_TYPES = new Set([
  "docs",
  "style",
  "chore",
  "refactor",
  "test",
  "build",
  "ci",
]);

/**
 * Parse a Conventional Commit header.
 *
 * @param {string} subject
 * @returns {{ type: string; scope?: string; breaking: boolean } | undefined}
 */
export function parseConventionalHeader(subject) {
  const match = /^([a-z]+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/.exec(
    (subject ?? "").trim(),
  );
  if (!match) return undefined;
  return { type: match[1], scope: match[2], breaking: match[3] === "!" };
}

/**
 * The release class a commit belongs to.
 *
 * `undefined` means "cannot tell" — an unparsable subject or a type this
 * repository does not know. Those are ignored rather than rejected.
 *
 * @param {{ subject: string; body?: string }} commit
 * @returns {"none" | "patch" | "feature" | "breaking" | undefined}
 */
export function classifyCommit(commit) {
  const header = parseConventionalHeader(commit.subject);
  if (!header) return undefined;

  // A footer marks a breaking change as loudly as the `!` does.
  const declaresBreaking = /^BREAKING[ -]CHANGE:/m.test(commit.body ?? "");
  if (header.breaking || declaresBreaking) return "breaking";

  if (FEATURE_TYPES.has(header.type)) return "feature";
  if (PATCH_TYPES.has(header.type)) return "patch";
  if (NONE_TYPES.has(header.type)) return "none";
  return undefined;
}

/**
 * Does this PR mix classes it cannot express in one squash subject?
 *
 * @param {{ subject: string; body?: string }[]} commits
 * @param {string} title The PR title — the future squash subject.
 * @returns {{
 *   ok: boolean;
 *   reason: string;
 *   titleClass: string | undefined;
 *   commitClasses: string[];
 *   offenders: { subject: string; class: string }[];
 * }}
 */
export function classifyMixture(commits, title) {
  const classified = commits
    .map((commit) => ({ ...commit, class: classifyCommit(commit) }))
    .filter((commit) => commit.class !== undefined);

  const releasing = classified.filter((commit) => commit.class !== "none");
  const commitClasses = [...new Set(releasing.map((commit) => commit.class))]
    .filter((value) => typeof value === "string")
    .sort((a, b) => CLASS_ORDER.indexOf(a) - CLASS_ORDER.indexOf(b));

  const titleClass = classifyCommit({ subject: title });
  const titleClassType = parseConventionalHeader(title)?.type ?? "that type";

  if (commitClasses.length > 1) {
    return {
      ok: false,
      reason:
        `the commits mix ${commitClasses.join(" and ")} changes, and one squash ` +
        "subject can only tell one of them",
      titleClass,
      commitClasses,
      offenders: releasing.map((commit) => ({
        subject: commit.subject,
        class: /** @type {string} */ (commit.class),
      })),
    };
  }

  // One class, but several scopes: the squash keeps one subject, so every
  // releasing commit outside the title's scope loses its description. Same
  // information loss as a class mixture, one level down. Repeats WITHIN a scope
  // are fine — `fix(List): a` plus `fix(List): b` is one logical change.
  if (commitClasses.length === 1) {
    const scopes = [
      ...new Set(
        releasing.map(
          (commit) => parseConventionalHeader(commit.subject)?.scope ?? "",
        ),
      ),
    ];
    if (scopes.length > 1) {
      return {
        ok: false,
        reason:
          `the commits carry ${commitClasses[0]} changes in ${scopes.length} ` +
          `different scopes (${scopes.map((scope) => scope || "none").join(", ")}) ` +
          "and the squash merge keeps only one subject, so the others reach no " +
          "changelog",
        titleClass,
        commitClasses,
        offenders: releasing.map((commit) => ({
          subject: commit.subject,
          class: /** @type {string} */ (commit.class),
        })),
      };
    }
  }

  // Nothing releasing, or nothing parsable: the title stands on its own.
  if (commitClasses.length === 0) {
    return {
      ok: true,
      reason:
        classified.length === 0
          ? "no commit carries a Conventional Commit subject — nothing to compare"
          : "no commit carries a releasing type",
      titleClass,
      commitClasses,
      offenders: [],
    };
  }

  const commitClass = commitClasses[0];

  if (titleClass === undefined) {
    return {
      ok: true,
      reason: `the title is not a Conventional Commit — \`conventional-title\` reports that`,
      titleClass,
      commitClasses,
      offenders: [],
    };
  }

  if (titleClass === commitClass) {
    return {
      ok: true,
      reason: `title and commits agree on \`${commitClass}\``,
      titleClass,
      commitClasses,
      offenders: [],
    };
  }

  const smuggling =
    CLASS_ORDER.indexOf(commitClass) > CLASS_ORDER.indexOf(titleClass);

  // Three different consequences, so three different messages. The one that
  // bites most often is the first: a `fix:` commit under a `docs:` title is not
  // routed wrongly, it is not released AT ALL.
  let reason;
  if (!smuggling) {
    reason =
      `the title claims ${titleClass} but no commit carries more than a ` +
      `${commitClass} change`;
  } else if (titleClass === "none") {
    reason =
      `the commits carry a ${commitClass} change but the title does not — the ` +
      "squash merge keeps only the title, so the change ships (relevance is " +
      `decided by the changed paths) while the changelog announces it as ` +
      `\`${titleClassType}\` and its own description is discarded`;
  } else {
    reason =
      `the commits carry a ${commitClass} change but the title claims ` +
      `${titleClass} — routing reads the title, so it would land on the wrong line`;
  }

  return {
    ok: false,
    reason,
    titleClass,
    commitClasses,
    offenders: releasing.map((commit) => ({
      subject: commit.subject,
      class: /** @type {string} */ (commit.class),
    })),
  };
}

/**
 * Scopes whose titles are machine-generated, so no human chose the type.
 *
 * Dependabot writes `build(deps-dev): bump the dev-minor group …`, and a group
 * is not homogeneous in effect: Rollup moves every `dist`, Prettier moves
 * nothing. `commit-message.prefix` is configured per ecosystem, not per group,
 * so no title Dependabot can produce would be true for all of them.
 */
const GENERATED_SCOPES = new Set(["deps", "deps-dev"]);

/**
 * Does the title admit that this pull request reaches a consumer?
 *
 * Checked in ONE direction only. A non-releasing type over shipping paths is
 * the expensive mistake: the change ships — relevance is decided by the paths —
 * while the changelog announces it as `docs`/`chore` and the commit's own
 * description is discarded. The other direction (a `fix:` title over paths that
 * reach nobody) costs nothing: the paths decide, so no release happens, and
 * `fix(docs): …` for a docs-app fix is an honest title.
 *
 * The fix is a releasing type, not a tag: `fix(docs): add a migration entry`
 * says both things at once — it ships, and it is documentation.
 *
 * @param {string} title
 * @param {boolean} pathsPublish
 * @returns {{ ok: boolean; reason: string }}
 */
export function classifyTitleRelease(title, pathsPublish) {
  const header = parseConventionalHeader(title);

  if (!header) {
    return {
      ok: true,
      reason:
        "the title is not a Conventional Commit — the title linter reports that",
    };
  }
  if (header.scope !== undefined && GENERATED_SCOPES.has(header.scope)) {
    return {
      ok: true,
      reason: `${header.type}(${header.scope}): is generated`,
    };
  }
  if (!pathsPublish) {
    return { ok: true, reason: "the changed paths reach no consumer" };
  }

  const titleClass = classifyCommit({ subject: title });
  if (titleClass !== "none") {
    return { ok: true, reason: `\`${header.type}\` admits that this releases` };
  }

  return {
    ok: false,
    reason:
      `the changed paths reach a consumer but the title says \`${header.type}\`, ` +
      "which does not — the change would ship while the changelog announces it " +
      `as \`${header.type}\`. Use a releasing type and keep the scope: ` +
      `\`fix(${header.scope ?? "scope"}): …\``,
  };
}
