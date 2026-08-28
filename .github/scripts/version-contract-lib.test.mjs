// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseRange,
  classifyRangeChange,
  classifyEngineChange,
  isBreakingMarker,
  collectFindings,
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
  assert.equal(classifyEngineChange(">1", ">=24.0.0"), "unparseable"); // garbage old floor → fail-closed
});

test("isBreakingMarker: title bang and body trailer", () => {
  assert.equal(isBreakingMarker("feat!: x", ""), true);
  assert.equal(isBreakingMarker("fix(Button)!: x", ""), true);
  assert.equal(isBreakingMarker("fix: x", "line\nBREAKING CHANGE: y"), true);
  assert.equal(isBreakingMarker("fix: x", "BREAKING-CHANGE: y"), true);
  assert.equal(isBreakingMarker("fix: x", "just a normal body"), false);
  assert.equal(isBreakingMarker("feat: x", ""), false); // feat without ! is not breaking
});

test("collectFindings: #2728-shaped diff → engine + peer findings", () => {
  const packages = [
    {
      name: "@mittwald/flow-icons",
      base: { name: "@mittwald/flow-icons" }, // existed, no engines
      head: { name: "@mittwald/flow-icons", engines: { node: ">=24.0.0" } },
    },
    {
      name: "@mittwald/flow-remote-react-components",
      base: {
        name: "@mittwald/flow-remote-react-components",
        peerDependencies: { "react-hook-form": "*" },
      },
      head: {
        name: "@mittwald/flow-remote-react-components",
        peerDependencies: { "react-hook-form": "^7.65.0" },
      },
    },
  ];
  const got = collectFindings(packages)
    .map((f) => `${f.package}:${f.surface}:${f.kind}`)
    .sort();
  assert.deepEqual(got, [
    "@mittwald/flow-icons:engines.node:raised",
    "@mittwald/flow-remote-react-components:peer:react-hook-form:narrowed",
  ]);
});

test("collectFindings: benign changes → no findings", () => {
  const packages = [
    {
      name: "@mittwald/flow-react-components",
      base: {
        name: "@mittwald/flow-react-components",
        peerDependencies: { react: "^19.2.0" },
      },
      head: {
        name: "@mittwald/flow-react-components",
        peerDependencies: { react: "^19.0.0 || ^20.0.0" }, // widened
      },
    },
    {
      name: "@mittwald/react-tunnel",
      base: { name: "@mittwald/react-tunnel" },
      head: {
        name: "@mittwald/react-tunnel",
        peerDependencies: { mobx: "^6.0.0" }, // newly-added peer, unflagged in v1
      },
    },
    {
      name: "@mittwald/flow-stylesheet",
      base: {
        name: "@mittwald/flow-stylesheet",
        engines: { node: ">=24.0.0" },
      },
      head: {
        name: "@mittwald/flow-stylesheet",
        engines: { node: ">=22.0.0" }, // lowered floor
      },
    },
  ];
  assert.deepEqual(collectFindings(packages), []);
});

test("collectFindings: non-publishable and new packages are skipped", () => {
  const packages = [
    {
      name: "@mittwald/flow-core",
      base: {
        name: "@mittwald/flow-core",
        private: "true", // string form
        peerDependencies: { react: "*" },
      },
      head: {
        name: "@mittwald/flow-core",
        private: "true",
        peerDependencies: { react: "^19.0.0" }, // would narrow, but skipped
      },
    },
    {
      name: "acorn",
      base: { name: "acorn", engines: { node: ">=0.4.0" } },
      head: { name: "acorn", engines: { node: ">=24.0.0" } }, // not @mittwald → skipped
    },
    {
      name: "@mittwald/flow-new",
      base: null, // brand-new package → skipped
      head: {
        name: "@mittwald/flow-new",
        engines: { node: ">=24.0.0" },
        peerDependencies: { react: "^19.0.0" },
      },
    },
  ];
  assert.deepEqual(collectFindings(packages), []);
});

test("collectFindings: boolean private:true is treated as private (skipped)", () => {
  const packages = [
    {
      name: "@mittwald/flow-codemods",
      base: {
        name: "@mittwald/flow-codemods",
        private: true, // boolean form (the common in-repo form)
        peerDependencies: { react: "*" },
      },
      head: {
        name: "@mittwald/flow-codemods",
        private: true,
        peerDependencies: { react: "^19.0.0" }, // would narrow, but skipped
      },
    },
  ];
  assert.deepEqual(collectFindings(packages), []);
});

test("collectFindings: unparseable peer change → fail-closed finding", () => {
  const packages = [
    {
      name: "@mittwald/flow-react-components",
      base: {
        name: "@mittwald/flow-react-components",
        peerDependencies: { react: "^19.0.0" },
      },
      head: {
        name: "@mittwald/flow-react-components",
        peerDependencies: { react: "latest" },
      },
    },
  ];
  const findings = collectFindings(packages);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "unparseable");
});

test("collectFindings: a package's first publish establishes the contract, not a tightening", () => {
  const packages = [
    {
      name: "@mittwald/flow-codemods",
      // Private, so never published: no floor, no peers, no consumers.
      base: { name: "@mittwald/flow-codemods", private: true },
      head: {
        name: "@mittwald/flow-codemods",
        engines: { node: ">=24.0.0" },
        peerDependencies: { react: "^19.2.0" },
      },
    },
  ];

  assert.deepEqual(collectFindings(packages), []);
});

test("collectFindings: an already-published package still cannot gain a floor unmarked", () => {
  const packages = [
    {
      name: "@mittwald/flow-react-components",
      base: { name: "@mittwald/flow-react-components" },
      head: {
        name: "@mittwald/flow-react-components",
        engines: { node: ">=24.0.0" },
      },
    },
  ];

  assert.deepEqual(
    collectFindings(packages).map(({ surface, kind }) => ({ surface, kind })),
    [{ surface: "engines.node", kind: "raised" }],
  );
});
