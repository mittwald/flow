// @ts-check
// Integration tests for `push-release.mjs`, driven against real git
// repositories in a temp directory. The whole point of the script is how git
// behaves under a concurrent push, so there is nothing worth testing in
// isolation from git itself.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const SCRIPT = resolve(import.meta.dirname, "push-release.mjs");

const git = (cwd, ...args) =>
  execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

/** A clone with an identity and no hooks, so pushes behave like the runner's. */
const clone = (origin, dir) => {
  execFileSync("git", ["clone", "--quiet", origin, dir]);
  git(dir, "config", "user.name", "Test");
  git(dir, "config", "user.email", "test@example.com");
  return dir;
};

const commit = (dir, file, contents, message) => {
  writeFileSync(join(dir, file), contents);
  git(dir, "add", file);
  git(dir, "commit", "--quiet", "-m", message);
};

const pushRelease = (cwd, branch, tag) =>
  spawnSync("node", [SCRIPT, branch, tag], { cwd, encoding: "utf8" });

/**
 * A bare `origin` on `main` with one commit, plus a `work` clone standing in
 * for the runner's checkout.
 */
const setup = (t) => {
  const root = mkdtempSync(join(tmpdir(), "push-release-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  const origin = join(root, "origin.git");
  execFileSync("git", ["init", "--quiet", "--bare", "-b", "main", origin]);

  const seed = clone(origin, join(root, "seed"));
  commit(seed, "package.json", '{"version":"1.0.0"}\n', "chore: seed");
  git(seed, "push", "--quiet", "origin", "main");

  return { root, origin, work: clone(origin, join(root, "work")) };
};

/** What a concurrent PR merge does to the line mid-build. */
const concurrentMerge = (root, origin, name) => {
  const other = clone(origin, join(root, name));
  commit(other, `${name}.md`, "merged mid-build\n", `fix: ${name}`);
  git(other, "push", "--quiet", "origin", "main");
};

/** The `chore(release):` commit plus the tag lerna places on it. */
const releaseCommit = (work, version) => {
  commit(
    work,
    "package.json",
    `{"version":"${version}"}\n`,
    `chore(release): bump version to ${version}`,
  );
  git(work, "tag", "-m", version, version);
};

const subject = (cwd, rev) => git(cwd, "log", "--format=%s", "-1", rev);

/**
 * The shape #3351 needs after a concurrent merge: the line's tip is a merge
 * whose FIRST parent is the tagged release commit and whose second parent is
 * the tip that advanced meanwhile.
 */
const assertReleaseMerge = (origin, version, secondParent) => {
  assert.equal(
    git(origin, "rev-list", "--parents", "-n", "1", "main").split(" ").length,
    3,
    "the tip is a merge commit",
  );
  assert.equal(
    git(origin, "rev-parse", `${version}^{commit}`),
    git(origin, "rev-parse", "main^1"),
    "the tag stays on the release commit, the first parent",
  );
  assert.equal(
    subject(origin, "main^1"),
    `chore(release): bump version to ${version}`,
  );
  assert.equal(subject(origin, "main^2"), secondParent);
};

test("pushes and tags when nothing else touched the line", async (t) => {
  const { origin, work } = setup(t);
  releaseCommit(work, "1.0.1");

  const result = pushRelease(work, "main", "1.0.1");

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    git(origin, "rev-parse", "main"),
    git(work, "rev-parse", "HEAD"),
  );
  assert.equal(
    git(origin, "rev-parse", "1.0.1^{commit}"),
    git(origin, "rev-parse", "main"),
  );
});

test("merges a change that landed while the release was building", async (t) => {
  const { root, origin, work } = setup(t);
  releaseCommit(work, "1.0.1");
  concurrentMerge(root, origin, "concurrent");

  const result = pushRelease(work, "main", "1.0.1");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /advanced while this release was building/);
  assertReleaseMerge(origin, "1.0.1", "fix: concurrent");

  // Not a `chore(release):` commit, so its push starts a regular publish run —
  // and not a Conventional Commit, so it stays out of the next changelog.
  assert.equal(subject(origin, "main"), "Merge main into release 1.0.1");

  // lerna-lite resolves the last release with `git describe --first-parent`,
  // and the next release's range then holds the concurrent change.
  assert.equal(
    git(origin, "describe", "--first-parent", "--abbrev=0", "main"),
    "1.0.1",
  );
  assert.deepEqual(
    git(origin, "log", "--format=%s", "1.0.1..main").split("\n"),
    ["Merge main into release 1.0.1", "fix: concurrent"],
  );

  // Both sides' content is on the line.
  assert.equal(
    git(origin, "show", "main:package.json").trim(),
    '{"version":"1.0.1"}',
  );
  assert.equal(git(origin, "show", "main:concurrent.md"), "merged mid-build");
});

test("survives several merges landing in a row", async (t) => {
  const { root, origin, work } = setup(t);
  releaseCommit(work, "1.0.1");
  concurrentMerge(root, origin, "first");
  concurrentMerge(root, origin, "second");

  const result = pushRelease(work, "main", "1.0.1");

  assert.equal(result.status, 0, result.stderr);
  assertReleaseMerge(origin, "1.0.1", "fix: second");
  assert.deepEqual(
    git(origin, "log", "--format=%s", "1.0.1..main").split("\n"),
    ["Merge main into release 1.0.1", "fix: second", "fix: first"],
  );
});

test("tags a pre-graduated promotion in place when the line advanced", async (t) => {
  // RFC #2711: the version commit arrived with the merge, so the runner has no
  // commit of its own — the promotion is already on the line, and only the
  // concurrent merge is newer. The tag does not exist yet and is created here,
  // on what was built rather than on the concurrent merge.
  const { root, origin, work } = setup(t);
  const promotion = git(work, "rev-parse", "HEAD");
  concurrentMerge(root, origin, "concurrent");

  const result = pushRelease(work, "main", "1.0.1");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /already contains/);
  assert.equal(git(origin, "rev-parse", "1.0.1^{commit}"), promotion);
  assert.equal(subject(origin, "main"), "fix: concurrent");
});

test("aborts the merge and fails loudly on a conflict", async (t) => {
  const { root, origin, work } = setup(t);
  releaseCommit(work, "1.0.1");

  // A concurrent merge writing the same file is not a case the release flow
  // models — the script must stop rather than guess a resolution.
  const other = clone(origin, join(root, "conflicting"));
  commit(other, "package.json", '{"version":"9.9.9"}\n', "fix: conflicting");
  git(other, "push", "--quiet", "origin", "main");

  const result = pushRelease(work, "main", "1.0.1");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /hit a conflict/);
  assert.match(result.stderr, /already on npm/);

  // Nothing half-applied: the line is untouched and no merge is in progress.
  assert.equal(subject(origin, "main"), "fix: conflicting");
  assert.equal(git(work, "status", "--porcelain"), "");
  assert.notEqual(
    spawnSync("git", ["rev-parse", "-q", "--verify", "MERGE_HEAD"], {
      cwd: work,
    }).status,
    0,
  );
  assert.equal(subject(work, "HEAD"), "chore(release): bump version to 1.0.1");
});

test("merges past a build artifact left in the working tree", async (t) => {
  // `pnpm build` runs between the release commit and this push, so the tree can
  // carry a regenerated file. Merge refuses to overwrite local changes.
  const { root, origin, work } = setup(t);
  releaseCommit(work, "1.0.1");
  concurrentMerge(root, origin, "concurrent");
  writeFileSync(
    join(work, "package.json"),
    '{"version":"1.0.1"}\n// rebuilt\n',
  );

  const result = pushRelease(work, "main", "1.0.1");

  assert.equal(result.status, 0, result.stderr);
  assertReleaseMerge(origin, "1.0.1", "fix: concurrent");
});

test("merges when the clone tracks a single branch", async (t) => {
  // actions/checkout narrows `remote.origin.fetch` to the run's own branch, so
  // `origin/<branch>` is not guaranteed to follow the fetch — the merge has to
  // go through FETCH_HEAD.
  const { root, origin, work } = setup(t);
  git(
    work,
    "config",
    "remote.origin.fetch",
    "+refs/heads/nothing:refs/remotes/origin/nothing",
  );
  releaseCommit(work, "1.0.1");
  concurrentMerge(root, origin, "concurrent");

  const result = pushRelease(work, "main", "1.0.1");

  assert.equal(result.status, 0, result.stderr);
  assertReleaseMerge(origin, "1.0.1", "fix: concurrent");
});

test("refuses to run without both arguments", async (t) => {
  const { work } = setup(t);
  assert.equal(spawnSync("node", [SCRIPT, "main"], { cwd: work }).status, 1);
});
