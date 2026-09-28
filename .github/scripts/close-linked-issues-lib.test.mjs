// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  collectClosingReferences,
  parseClosingReferences,
} from "./close-linked-issues-lib.mjs";

const REPO = "mittwald/flow";

test("parse: every closing keyword GitHub accepts", () => {
  for (const keyword of [
    "close",
    "closes",
    "closed",
    "fix",
    "fixes",
    "fixed",
    "resolve",
    "resolves",
    "resolved",
  ]) {
    assert.deepEqual(
      parseClosingReferences(`${keyword} #123`, REPO).own,
      [123],
      keyword,
    );
    assert.deepEqual(
      parseClosingReferences(`${keyword.toUpperCase()} #123`, REPO).own,
      [123],
      `${keyword} (upper case)`,
    );
  }
});

test("parse: a non-closing verb is a plain reference", () => {
  for (const text of [
    "Part of #123",
    "See #123",
    "Related to #123",
    "Came up in #123",
    "Found while working on #123",
    "Follow-up from #123",
    "#123",
    "Reverts #123",
    "Supersedes #123",
  ]) {
    assert.deepEqual(parseClosingReferences(text, REPO).own, [], text);
  }
});

test("parse: the three reference notations", () => {
  assert.deepEqual(parseClosingReferences("Closes #3189", REPO).own, [3189]);
  assert.deepEqual(parseClosingReferences("Closes GH-3189", REPO).own, [3189]);
  assert.deepEqual(
    parseClosingReferences("Closes mittwald/flow#3189", REPO).own,
    [3189],
  );
  // Case is not part of a GitHub repository's identity.
  assert.deepEqual(
    parseClosingReferences("Closes MittWald/Flow#3189", REPO).own,
    [3189],
  );
});

test("parse: another repository is reported, never closed", () => {
  const references = parseClosingReferences(
    "Fixes adobe/react-spectrum#9057 and closes #3189.",
    REPO,
  );

  assert.deepEqual(references.own, [3189]);
  assert.deepEqual(references.foreign, ["adobe/react-spectrum#9057"]);
});

test("parse: separator forms", () => {
  assert.deepEqual(parseClosingReferences("Closes: #123", REPO).own, [123]);
  assert.deepEqual(parseClosingReferences("Closes   #123", REPO).own, [123]);
  assert.deepEqual(parseClosingReferences("closes\n#123", REPO).own, [123]);
  // No separator at all is not a reference GitHub resolves either.
  assert.deepEqual(parseClosingReferences("Closes#123", REPO).own, []);
});

test("parse: the keyword has to be a whole word", () => {
  for (const text of [
    "Unclosed #123",
    "Prefixes #123",
    "hotfixes #123",
    "foreclose #123",
  ]) {
    assert.deepEqual(parseClosingReferences(text, REPO).own, [], text);
  }
});

test("parse: several references, order preserved and deduplicated", () => {
  const text = "Closes #30, fixes #12 and resolves #30.";
  assert.deepEqual(parseClosingReferences(text, REPO).own, [30, 12]);
});

test("parse: no text is no reference", () => {
  for (const text of [null, undefined, ""]) {
    assert.deepEqual(parseClosingReferences(text, REPO), {
      own: [],
      foreign: [],
    });
  }
});

test("parse: code — a fenced block does not close anything", () => {
  const body = [
    "The guard reads the title only:",
    "",
    "```sh",
    "# Closes #999 — quoted from the other workflow",
    "grep -qE '^feat'",
    "```",
    "",
    "Closes #123",
  ].join("\n");

  assert.deepEqual(parseClosingReferences(body, REPO).own, [123]);
});

test("parse: code — tilde fences and longer closing fences", () => {
  const body = [
    "~~~",
    "Closes #999",
    "~~~",
    "````md",
    "Closes #998",
    "`````",
    "Fixes #123",
  ].join("\n");

  assert.deepEqual(parseClosingReferences(body, REPO).own, [123]);
});

test("parse: code — an inline span does not close, and does not glue text together", () => {
  assert.deepEqual(
    parseClosingReferences("The entry says `Closes #999` verbatim.", REPO).own,
    [],
  );
  // The span leaves a marker behind, so the keyword before it cannot reach the
  // number after it.
  assert.deepEqual(
    parseClosingReferences("Closes `the ticket` #999", REPO).own,
    [],
  );
});

test("parse: code — an unterminated fence swallows the rest", () => {
  const body = ["```", "Closes #123"].join("\n");
  assert.deepEqual(parseClosingReferences(body, REPO).own, []);
});

test("parse: code — an indented fence inside a list item still fences", () => {
  const body = [
    "- Example:",
    "  ```",
    "  Closes #999",
    "  ```",
    "",
    "Fixes #1",
  ].join("\n");

  assert.deepEqual(parseClosingReferences(body, REPO).own, [1]);
});

test("collect: body and commit messages are merged and deduplicated", () => {
  const references = collectClosingReferences({
    body: "Closes #3189.\n\nPart of #3166.",
    commitMessages: [
      "feat(Action): close the nearest overlay with a bare closeOverlay\n\nCloses #3189.",
      "test(Action): cover the nested case\n\nFixes #3190",
      "chore: formatting",
    ],
    repo: REPO,
  });

  assert.deepEqual(references.own, [3189, 3190]);
  assert.deepEqual(references.foreign, []);
});

test("collect: no commits is the same as an empty list", () => {
  assert.deepEqual(
    collectClosingReferences({ body: "Fixes #7", repo: REPO }).own,
    [7],
  );
});

test("collect: a real PR body closes exactly what it says", () => {
  // #3204's body, trimmed — the PR that fixed #3059 and stayed unlinked.
  const body = [
    "Closes #3059.",
    "",
    "`upgrade` and `list <revision>` never surfaced what the Flow packages",
    "themselves peer on. A consumer reading the report could not tell whether",
    "`react-tunnel@^1` was a range we require.",
    "",
    "```json",
    '{ "peerDependencies": { "react": "^19" } }',
    "```",
    "",
    "Came up in #3117.",
  ].join("\n");

  const references = collectClosingReferences({ body, repo: REPO });

  assert.deepEqual(references.own, [3059]);
  assert.deepEqual(references.foreign, []);
});
