// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseRange,
  classifyRangeChange,
  classifyEngineChange,
} from "./version-contract-lib.mjs";

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
  assert.equal(parseRange("16"), null); // bare partial version (X-range) unsupported
  assert.equal(parseRange("1.2"), null); // partial version unsupported
  assert.equal(parseRange("~1"), null); // partial tilde unsupported
  assert.equal(parseRange("^19"), null); // partial caret unsupported
});

test("classifyRangeChange: widen / equal → ok", () => {
  assert.equal(classifyRangeChange("^19.2.0", "^19.0.0 || ^20.0.0"), "ok"); // widen
  assert.equal(classifyRangeChange("^19.2.0", "^19.2.0"), "ok"); // equal
  assert.equal(classifyRangeChange("^19.2.0", ">=19.2.0"), "ok"); // widen to open
  assert.equal(classifyRangeChange("1.2.3", "^1.0.0"), "ok"); // point → wider caret
});

test("classifyRangeChange: narrow / shift / raised-min → narrowed", () => {
  assert.equal(classifyRangeChange("*", "^7.65.0"), "narrowed"); // #2728 react-hook-form
  assert.equal(
    classifyRangeChange("^18.0.0 || ^19.0.0", "^19.0.0"),
    "narrowed",
  ); // drop a major
  assert.equal(classifyRangeChange("^18.0.0", "^19.0.0"), "narrowed"); // shift up
  assert.equal(classifyRangeChange(">=18.0.0", ">=20.0.0"), "narrowed"); // raise min
});

test("classifyRangeChange: unparseable either side → unparseable", () => {
  assert.equal(classifyRangeChange(">1", "^2.0.0"), "unparseable");
  assert.equal(classifyRangeChange("^1.0.0", "latest"), "unparseable");
});

test("classifyEngineChange: raises vs relaxations", () => {
  assert.equal(classifyEngineChange(null, ">=24.0.0"), "raised"); // add a floor
  assert.equal(classifyEngineChange(">=20.0.0", ">=24.0.0"), "raised"); // raise
  assert.equal(classifyEngineChange(">=24.0.0", ">=20.0.0"), "ok"); // lower
  assert.equal(classifyEngineChange(">=24.0.0", null), "ok"); // remove floor
  assert.equal(classifyEngineChange(">=24.0.0", ">=24.0.0"), "ok"); // unchanged
});
