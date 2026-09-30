// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyMessage, isExemptPr, routingErrors } from "./routing-lib.mjs";

const REPO = "mittwald/flow";

const pr = (overrides = {}) => ({
  baseRef: "main",
  headRef: "claude/some-fix",
  headRepo: REPO,
  repo: REPO,
  title: "fix(Button): keep the focus ring",
  body: "",
  commits: [],
  ...overrides,
});

const commit = (message, sha = "abc123def") => ({ sha, message });

test("classify: feat and feature headers, any case, any scope", () => {
  for (const header of [
    "feat: x",
    "feat(Button): x",
    "feat!: x",
    "Feat: x",
    "feature: x",
    "feature(Flex): x",
    "feat(): x",
  ]) {
    assert.equal(classifyMessage(header).isFeat, true, header);
  }
  for (const header of ["fix: feat", "features: x", "chore(feat): x"]) {
    assert.equal(classifyMessage(header).isFeat, false, header);
  }
});

test("classify: breaking headers the parser accepts", () => {
  for (const header of [
    "fix(Button)!: x",
    "Feat!: x",
    "Fix!: x",
    "fix()!: x",
    "fix(a(b))!: x",
    "!: x",
  ]) {
    assert.equal(classifyMessage(header).isBreaking, true, header);
  }
  assert.equal(classifyMessage("fix(Button): x!").isBreaking, false);
});

test("classify: breaking footers the parser accepts", () => {
  for (const footer of [
    "BREAKING CHANGE: y",
    "BREAKING-CHANGE: y",
    "* BREAKING CHANGE: y",
    "Breaking change: y",
    "breaking-change: y",
  ]) {
    assert.equal(
      classifyMessage(`fix: x\n\n${footer}`).isBreaking,
      true,
      footer,
    );
  }
  assert.equal(
    classifyMessage("fix: x\n\nnot a BREAKING CHANGE: inline").isBreaking,
    false,
  );
});

test("exempt: promotion and sync heads of this repository", () => {
  for (const headRef of [
    "next",
    "release/1.4.0",
    "sync/main-into-next",
    "2.x",
  ]) {
    assert.equal(isExemptPr({ headRef, headRepo: REPO, repo: REPO }), true);
  }
  for (const headRef of ["claude/release-notes", "feat/next-thing"]) {
    assert.equal(isExemptPr({ headRef, headRepo: REPO, repo: REPO }), false);
  }
});

test("exempt: a fork's promotion-like head is an ordinary PR", () => {
  for (const headRef of ["next", "2.x", "release/1.4.0", "sync/x"]) {
    assert.equal(
      isExemptPr({ headRef, headRepo: "someone/flow", repo: REPO }),
      false,
      headRef,
    );
  }
});

test("main: a fix PR with fix commits passes", () => {
  assert.deepEqual(
    routingErrors(
      pr({ commits: [commit("fix(Button): a"), commit("test: b")] }),
    ),
    [],
  );
});

test("main: a feat commit under a fix title fails (#3290)", () => {
  const errors = routingErrors(
    pr({
      title:
        "fix(CodeBlock): let the collapsed code run under the show-more button",
      commits: [
        commit("fix(CodeBlock): move the show-more button closer"),
        commit(
          "feat(CodeBlock): animate showing more and less\n\nBody.",
          "20485fcd2",
        ),
      ],
    }),
  );
  assert.equal(errors.length, 1);
  assert.match(errors[0], /20485fcd2/);
  assert.match(errors[0], /feat\(CodeBlock\): animate showing more and less/);
});

test("main: a feature commit under a fix title fails", () => {
  assert.equal(
    routingErrors(pr({ commits: [commit("feature(Flex): x")] })).length,
    1,
  );
});

test("main: a feat title fails", () => {
  assert.equal(routingErrors(pr({ title: "feat(Button): x" })).length, 1);
});

test("next: feat title and feat commits pass", () => {
  assert.deepEqual(
    routingErrors(
      pr({
        baseRef: "next",
        title: "feat(Button): x",
        commits: [commit("feat(Button): x")],
      }),
    ),
    [],
  );
});

test("next: a breaking commit fails (#3199)", () => {
  const errors = routingErrors(
    pr({
      baseRef: "next",
      title: "feat(CoachMark): add a self-opening hint",
      commits: [
        commit(
          "refactor(CoachMark)!: compose the dismiss action instead of labelling it",
        ),
      ],
    }),
  );
  assert.equal(errors.length, 1);
  assert.match(errors[0], /breaking/);
});

test("next: a star-bulleted breaking footer fails", () => {
  assert.equal(
    routingErrors(
      pr({
        baseRef: "next",
        title: "feat(Button): x",
        commits: [commit("feat(Button): x\n\n* BREAKING CHANGE: removed y")],
      }),
    ).length,
    1,
  );
});

test("breaking: a footer in the PR body fails", () => {
  assert.equal(
    routingErrors(pr({ body: "BREAKING CHANGE: removed x" })).length,
    1,
  );
});

test("exempt heads skip every rule", () => {
  assert.deepEqual(
    routingErrors(
      pr({
        headRef: "release/1.4.0",
        title: "chore(promotion): promote next to 1.4.0",
        commits: [commit("feat(Button)!: x")],
      }),
    ),
    [],
  );
});

test("a fork's release/* head gets every rule", () => {
  assert.equal(
    routingErrors(
      pr({
        headRef: "release/1.4.0",
        headRepo: "someone/flow",
        commits: [commit("feat(Button): x")],
      }),
    ).length,
    1,
  );
});
