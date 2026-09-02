// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyTitle, reconcile } from "./release-title-lib.mjs";

test("classifyTitle: the type decides by default", () => {
  for (const subject of [
    "fix(List): let items follow the state they are rendered from",
    "feat(CartesianChart): add Bar and a layout prop",
    "perf(components): stop shipping design-token build metadata",
    "revert(components): remove the easter egg",
  ]) {
    const result = classifyTitle(subject);
    assert.equal(result.publish, true, subject);
    assert.equal(result.source, "type");
  }

  for (const subject of [
    "docs: add Documentation section to CONTRIBUTE.md",
    "ci: split the test suite into parallel jobs",
    "chore(security): add minimumReleaseAge",
    "test(Visual): fixes remote error during tests",
    "build(components): use the next-themes client entry in Storybook",
    "refactor(components): triage the selector-max-type warnings",
    "style: reformat",
  ]) {
    const result = classifyTitle(subject);
    assert.equal(result.publish, false, subject);
    assert.equal(result.source, "type");
  }
});

test("classifyTitle: a tag overrides the type", () => {
  // #3062 shipped the migration catalogue under a docs title.
  const shipping = classifyTitle(
    "docs(codemods): add migration entry for Tabs [release]",
  );
  assert.equal(shipping.publish, true);
  assert.equal(shipping.source, "tag");

  // #3020 patched an apps/docs dependency under a fix title, and cut 1.1.5.
  const inert = classifyTitle(
    "fix(docs): drop the classic JSX transform debug props [no-release]",
  );
  assert.equal(inert.publish, false);
  assert.equal(inert.source, "tag");
});

test("classifyTitle: both tags is a conflict, not a decision", () => {
  const result = classifyTitle("fix(x): y [release] [no-release]");
  assert.equal(result.publish, undefined);
  assert.equal(result.conflict, true);
});

test("classifyTitle: the release machinery is structural", () => {
  assert.equal(
    classifyTitle("chore(release): bump version to 1.1.11").publish,
    false,
  );
  assert.equal(
    classifyTitle("chore(promotion): promote next to 1.1.0").publish,
    true,
  );
  // A forward-merge carries whatever main accumulated (ADR 0004 §6).
  assert.equal(
    classifyTitle("chore(sync): forward-merge main into next (9f3160b77)")
      .publish,
    undefined,
  );
});

test("classifyTitle: generated subjects fall back to the paths", () => {
  // A Dependabot group is not homogeneous in effect: Rollup moves every dist,
  // Prettier moves nothing, and one prefix covers the whole group.
  for (const subject of [
    "build(deps-dev): bump the dev-minor group with 2 updates",
    "build(deps): bump the production group across 1 directory with 5 updates",
    "chore(deps-dev): bump the dev-patch group",
  ]) {
    const result = classifyTitle(subject);
    assert.equal(result.publish, undefined, subject);
    assert.equal(result.source, "machinery");
  }
});

test("classifyTitle: an unreadable subject fails safe", () => {
  for (const subject of [
    "",
    "Merge pull request #3033 from mittwald/sync",
    "WIP",
  ]) {
    assert.equal(classifyTitle(subject).publish, undefined, subject);
  }
  // An unknown type is unknown, not non-publishing.
  assert.equal(classifyTitle("wip(components): something").publish, undefined);
});

test("reconcile: agreement decides by title", () => {
  const result = reconcile(classifyTitle("fix(List): x"), true);
  assert.equal(result.agree, true);
  assert.equal(result.publish, true);
  assert.equal(result.decidedBy, "title");
});

test("reconcile: a title that cannot answer never disagrees", () => {
  for (const pathsPublish of [true, false]) {
    const result = reconcile(
      classifyTitle("chore(sync): forward-merge main into next (abc)"),
      pathsPublish,
    );
    assert.equal(result.agree, true);
    assert.equal(result.publish, pathsPublish);
    assert.equal(result.decidedBy, "paths");
  }
});

test("reconcile: disagreement is reported, never silently resolved", () => {
  // The four historical mislabels: a hidden type that does reach a consumer.
  const swallowed = reconcile(classifyTitle("docs: set max text width"), true);
  assert.equal(swallowed.agree, false);
  assert.match(swallowed.reason, /\[release\]/);

  // And the other direction: a fix: that reaches nobody.
  const needless = reconcile(
    classifyTitle("fix(ci): merge driver no longer reverts"),
    false,
  );
  assert.equal(needless.agree, false);
  assert.match(needless.reason, /\[no-release\]/);
});
