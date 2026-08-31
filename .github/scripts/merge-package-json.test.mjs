// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import driver from "./merge-package-json.cjs";

const { compareSemver, parseSemver, pickVersion } = driver;

const DRIVER = resolve(import.meta.dirname, "merge-package-json.cjs");

test("parseSemver: full triples parse, anything else does not", () => {
  assert.deepEqual(parseSemver("1.0.2")?.release, [1, 0, 2]);
  assert.deepEqual(parseSemver("1.1.0-next.4")?.pre, ["next", "4"]);
  assert.equal(parseSemver("1.0.2+build.1")?.pre, null); // build metadata ignored
  assert.equal(parseSemver("workspace:*"), null);
  assert.equal(parseSemver("1.0"), null);
  assert.equal(parseSemver("latest"), null);
  assert.equal(parseSemver(undefined), null);
});

test("compareSemver: release precedence", () => {
  assert.equal(compareSemver("1.0.1", "1.0.2"), -1);
  assert.equal(compareSemver("1.0.2", "1.0.2"), 0);
  assert.equal(compareSemver("1.1.0", "1.0.99"), 1);
  assert.equal(compareSemver("2.0.0", "1.99.99"), 1);
});

test("compareSemver: a prerelease ranks below its own release, above the one before", () => {
  assert.equal(compareSemver("1.1.0-next.0", "1.1.0"), -1);
  // The property the cascade rests on: `next` outranks every `main` patch.
  assert.equal(compareSemver("1.1.0-next.0", "1.0.99"), 1);
  assert.equal(compareSemver("1.1.0-next.10", "1.1.0-next.9"), 1); // numeric, not lexical
  assert.equal(compareSemver("1.1.0-next.1", "1.1.0-next.1.1"), -1); // shorter is lower
  assert.equal(compareSemver("1.1.0-alpha", "1.1.0-beta"), -1);
  assert.equal(compareSemver("1.1.0-1", "1.1.0-alpha"), -1); // numeric < alphanumeric
});

test("compareSemver: unparseable sorts below every real version", () => {
  assert.equal(compareSemver("workspace:*", "1.0.0"), -1);
  assert.equal(compareSemver("1.0.0", "workspace:*"), 1);
  assert.equal(compareSemver("workspace:*", "latest"), 0);
});

test("pickVersion: the higher side wins, in both directions", () => {
  assert.equal(pickVersion("1.1.0-next.4", "1.0.2"), "1.1.0-next.4"); // main → next
  assert.equal(pickVersion("1.0.0", "1.0.2"), "1.0.2"); // main → feature branch
  assert.equal(pickVersion("1.0.2", "1.0.2"), "1.0.2");
});

test("pickVersion: undefined when neither side is a usable version", () => {
  assert.equal(pickVersion(undefined, undefined), undefined);
  assert.equal(pickVersion("workspace:*", undefined), undefined);
  assert.equal(pickVersion(undefined, "1.0.2"), "1.0.2");
});

/**
 * End-to-end through git itself. The pure helpers above cannot catch the actual
 * defect this driver had — that only shows up once git decides WHEN to invoke a
 * driver and what it does with the result.
 */
function withRepo(run) {
  const dir = mkdtempSync(join(tmpdir(), "flow-merge-driver-"));
  const git = (...args) =>
    execFileSync("git", args, { cwd: dir, encoding: "utf8" });
  const manifest = (version, deps) =>
    writeFileSync(
      join(dir, "pkg", "package.json"),
      `${JSON.stringify({ name: "p", version, dependencies: deps }, null, 2)}\n`,
    );
  const readManifest = () =>
    JSON.parse(readFileSync(join(dir, "pkg", "package.json"), "utf8"));

  try {
    git("init", "-q", "-b", "main");
    git("config", "user.email", "t@example.com");
    git("config", "user.name", "t");
    git("config", "merge.package-json.driver", `node ${DRIVER} %O %A %B %L %P`);
    writeFileSync(
      join(dir, ".gitattributes"),
      "**/package.json merge=package-json\n",
    );
    mkdirSync(join(dir, "pkg"));
    manifest("1.0.0", { a: "^1.0.0" });
    git("add", "-A");
    git("commit", "-qm", "base");
    run({ dir, git, manifest, readManifest });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("git merge: a release bump from the merged-in branch reaches a feature branch", () => {
  withRepo(({ git, manifest, readManifest }) => {
    git("checkout", "-qb", "feature");
    manifest("1.0.0", { a: "^1.0.0", b: "^2.0.0" }); // the branch's own change
    git("commit", "-qam", "feat: add b");

    git("checkout", "-q", "main");
    manifest("1.0.2", { a: "^1.0.0" });
    git("commit", "-qam", "chore(release): bump version to 1.0.2");

    git("checkout", "-q", "feature");
    git("merge", "--no-edit", "main");

    const merged = readManifest();
    assert.equal(
      merged.version,
      "1.0.2",
      "the release bump must not be reverted",
    );
    assert.equal(
      merged.dependencies.b,
      "^2.0.0",
      "the branch's own change must survive",
    );
  });
});

test("git merge: the higher line keeps its version when a lower one is merged up", () => {
  withRepo(({ git, manifest, readManifest }) => {
    git("checkout", "-qb", "next");
    manifest("1.1.0-next.4", { a: "^1.0.0" });
    git("commit", "-qam", "chore(release): 1.1.0-next.4");

    git("checkout", "-q", "main");
    manifest("1.0.2", { a: "^1.0.0", x: "^3.0.0" }); // a real dependency bump
    git("commit", "-qam", "chore(release): bump version to 1.0.2");

    git("checkout", "-q", "next");
    git("merge", "--no-edit", "main");

    const merged = readManifest();
    assert.equal(
      merged.version,
      "1.1.0-next.4",
      "the collection line keeps its own version",
    );
    assert.equal(
      merged.dependencies.x,
      "^3.0.0",
      "a genuine dependency bump still merges",
    );
  });
});

test("git merge: a genuine conflict in another field still conflicts", () => {
  withRepo(({ dir, git, manifest }) => {
    git("checkout", "-qb", "feature");
    manifest("1.0.0", { a: "^9.0.0" });
    git("commit", "-qam", "feat: bump a to 9");

    git("checkout", "-q", "main");
    manifest("1.0.2", { a: "^5.0.0" });
    git("commit", "-qam", "fix: bump a to 5");

    git("checkout", "-q", "feature");
    assert.throws(() => git("merge", "--no-edit", "main"), /.*/);
    const unmerged = execFileSync(
      "git",
      ["diff", "--name-only", "--diff-filter=U"],
      { cwd: dir, encoding: "utf8" },
    );
    assert.match(unmerged, /pkg\/package\.json/);
  });
});
