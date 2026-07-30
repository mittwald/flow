// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRange } from "./version-contract-lib.mjs";

test("parseRange: supported shapes parse to a non-null IntervalSet", () => {
  assert.ok(parseRange("*"));
  assert.ok(parseRange(""));
  assert.ok(parseRange(">=24.0.0"));
  assert.ok(parseRange("^19.2.0"));
  assert.ok(parseRange("~1.2.3"));
  assert.ok(parseRange("1.2.3"));
  assert.ok(parseRange("^19.0.0 || ^20.0.0"));
});

test("parseRange: unsupported shapes → null (fail-closed upstream)", () => {
  assert.equal(parseRange(">1.0.0"), null); // strict-greater unsupported
  assert.equal(parseRange("1.2.3-beta"), null); // prerelease tag unsupported
  assert.equal(parseRange(">=1 <2"), null); // space-joined range unsupported
  assert.equal(parseRange("latest"), null); // dist-tag
  assert.equal(parseRange(null), null);
  assert.equal(parseRange(undefined), null);
});
