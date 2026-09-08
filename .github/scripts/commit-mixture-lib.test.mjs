// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyCommit,
  classifyMixture,
  classifyTitleRelease,
} from "./commit-mixture-lib.mjs";

const c = (subject, body) => ({ subject, body });

test("classifyCommit: the type decides the class", () => {
  assert.equal(classifyCommit(c("feat(List): add a prop")), "feature");
  assert.equal(classifyCommit(c("fix(List): stop the crash")), "patch");
  assert.equal(classifyCommit(c("perf(components): drop metadata")), "patch");
  assert.equal(classifyCommit(c("revert(List): undo the prop")), "patch");
  assert.equal(classifyCommit(c("docs: explain the prop")), "none");
  assert.equal(classifyCommit(c("ci: shard the suite")), "none");
});

test("classifyCommit: both breaking markers count", () => {
  assert.equal(classifyCommit(c("feat(List)!: drop the old prop")), "breaking");
  assert.equal(
    classifyCommit(
      c("fix(List): tidy up", "BREAKING CHANGE: the prop is gone"),
    ),
    "breaking",
  );
  assert.equal(
    classifyCommit(
      c("fix(List): tidy up", "BREAKING-CHANGE: the prop is gone"),
    ),
    "breaking",
  );
});

test("classifyCommit: a branch commit that is not conventional is ignored", () => {
  for (const subject of [
    "wip",
    "review feedback",
    "fixup! fix(List): stop the crash",
    "Merge branch 'main' into feature",
    "",
  ]) {
    assert.equal(classifyCommit(c(subject)), undefined, subject);
  }
  // An unknown type is unknown, not "none".
  assert.equal(classifyCommit(c("wip(List): something")), undefined);
});

test("classifyMixture: one releasing class plus non-releasing ones is fine", () => {
  const result = classifyMixture(
    [
      c("feat(List): add a prop"),
      c("docs(List): document the prop"),
      c("test(List): cover the prop"),
      c("wip"),
    ],
    "feat(List): add a prop",
  );
  assert.equal(result.ok, true);
  assert.deepEqual(result.commitClasses, ["feature"]);
});

test("classifyMixture: feat and fix together cannot be squashed", () => {
  const result = classifyMixture(
    [c("fix(List): stop the crash"), c("feat(List): add a prop")],
    "fix(List): stop the crash",
  );
  assert.equal(result.ok, false);
  assert.match(result.reason, /mix patch and feature/);
  assert.equal(result.offenders.length, 2);
});

test("classifyMixture: a breaking commit under a fix title is smuggling", () => {
  const result = classifyMixture(
    [c("fix(List): tidy up", "BREAKING CHANGE: the prop is gone")],
    "fix(List): tidy up",
  );
  assert.equal(result.ok, false);
  assert.match(result.reason, /routing reads the title/);
});

test("classifyMixture: a feat commit under a fix title is smuggling", () => {
  // The dangerous direction: routing sends `fix:` to main, so the feature
  // would land on the stable line.
  const result = classifyMixture(
    [c("feat(List): add a prop"), c("docs: mention it")],
    "fix(List): add a prop",
  );
  assert.equal(result.ok, false);
  assert.equal(result.titleClass, "patch");
  assert.deepEqual(result.commitClasses, ["feature"]);
});

test("classifyMixture: a docs title announces a fix as documentation", () => {
  // The common shape: the docs work is the headline and the fix rides along.
  // Relevance is decided by the changed paths, so the fix DOES ship — but the
  // squash keeps only the title, so the changelog files it under docs and the
  // fix's own description is gone.
  const result = classifyMixture(
    [c("docs(List): document the states"), c("fix(List): stop the crash")],
    "docs(List): document the states",
  );
  assert.equal(result.ok, false);
  assert.equal(result.titleClass, "none");
  assert.match(result.reason, /the changelog announces it as `docs`/);
  assert.deepEqual(result.offenders, [
    { subject: "fix(List): stop the crash", class: "patch" },
  ]);
});

test("classifyMixture: releasing commits across scopes lose their descriptions", () => {
  const result = classifyMixture(
    [c("fix(List): stop the crash"), c("fix(Button): keep the label")],
    "fix(List): stop the crash",
  );
  assert.equal(result.ok, false);
  assert.match(result.reason, /2 different scopes \(List, Button\)/);

  // Repeats within one scope are one logical change.
  const sameScope = classifyMixture(
    [c("fix(List): stop the crash"), c("fix(List): keep the selection")],
    "fix(List): stop the crash",
  );
  assert.equal(sameScope.ok, true);

  // And a scopeless pair is one scope, not two.
  const scopeless = classifyMixture(
    [c("fix: one thing"), c("fix: another thing")],
    "fix: one thing",
  );
  assert.equal(scopeless.ok, true);
});

test("classifyMixture: a title claiming more than the commits is mislabelling", () => {
  const result = classifyMixture(
    [c("fix(List): stop the crash")],
    "feat(List): stop the crash",
  );
  assert.equal(result.ok, false);
  assert.match(result.reason, /no commit carries more than a patch change/);
});

test("classifyMixture: nothing releasing leaves the title alone", () => {
  const docsOnly = classifyMixture(
    [c("docs: a page"), c("ci: a workflow")],
    "docs: a page",
  );
  assert.equal(docsOnly.ok, true);

  // A docs-only branch may still be titled `fix:` — whether that releases is
  // the release-intent guard's question, not this one's.
  const titledFix = classifyMixture([c("docs: a page")], "fix(docs): a page");
  assert.equal(titledFix.ok, true);

  const nothingParsable = classifyMixture(
    [c("wip"), c("more wip")],
    "fix(x): y",
  );
  assert.equal(nothingParsable.ok, true);
  assert.match(nothingParsable.reason, /nothing to compare/);
});

test("classifyMixture: an unconventional title is left to the title linter", () => {
  const result = classifyMixture([c("feat(List): add a prop")], "add a prop");
  assert.equal(result.ok, true);
  assert.equal(result.titleClass, undefined);
});

test("classifyTitleRelease: a non-releasing title over shipping paths fails", () => {
  // #2902 changed two `.module.scss` files under a `docs:` title.
  const result = classifyTitleRelease("docs: set max text width", true);
  assert.equal(result.ok, false);
  assert.match(result.reason, /Use a releasing type and keep the scope/);

  // #3062 — the fix is `fix(codemods):`, which says both things at once.
  const scoped = classifyTitleRelease(
    "docs(codemods): add a migration entry",
    true,
  );
  assert.equal(scoped.ok, false);
  assert.match(scoped.reason, /fix\(codemods\)/);
});

test("classifyTitleRelease: a releasing title admits it", () => {
  for (const title of [
    "fix(List): stop the crash",
    "fix(docs): add a migration entry",
    "feat(List): add a prop",
    "perf(components): drop metadata",
  ]) {
    assert.equal(classifyTitleRelease(title, true).ok, true, title);
  }
});

test("classifyTitleRelease: the other direction never fails", () => {
  // A `fix(docs):` over the docs app reaches nobody, and the paths decide that
  // — nothing to report. #3020 and #2993 are exactly this shape.
  assert.equal(
    classifyTitleRelease("fix(docs): stop the footer overflowing", false).ok,
    true,
  );
  assert.equal(classifyTitleRelease("docs: a page", false).ok, true);
});

test("classifyTitleRelease: generated and unparsable titles are exempt", () => {
  assert.equal(
    classifyTitleRelease("build(deps-dev): bump the dev-minor group", true).ok,
    true,
  );
  assert.equal(
    classifyTitleRelease("build(deps): bump the production group", true).ok,
    true,
  );
  assert.equal(classifyTitleRelease("add a prop", true).ok, true);
});
