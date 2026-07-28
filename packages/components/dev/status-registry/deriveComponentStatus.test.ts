import { expect, test } from "vitest";
import { deriveComponentStatus } from "./deriveComponentStatus";

test.each([
  // [description, tags, expected]
  ["no tags → stable", undefined, { level: "stable", isNew: false }],
  ["empty tags → stable", {}, { level: "stable", isNew: false }],
  ["flowStatus beta", { flowStatus: "beta" }, { level: "beta", isNew: false }],
  [
    "flowStatus new only",
    { flowStatus: "new" },
    { level: "stable", isNew: true },
  ],
  [
    "flowStatus beta, new (comma + space)",
    { flowStatus: "beta, new" },
    { level: "beta", isNew: true },
  ],
  [
    "flowStatus new,beta (order + no space)",
    { flowStatus: "new,beta" },
    { level: "beta", isNew: true },
  ],
  [
    "component @deprecated → deprecated",
    { deprecated: "Use X instead." },
    { level: "deprecated", isNew: false },
  ],
  [
    "empty @deprecated tag still deprecated",
    { deprecated: "" },
    { level: "deprecated", isNew: false },
  ],
  [
    "deprecated wins over beta",
    { flowStatus: "beta", deprecated: "gone soon" },
    { level: "deprecated", isNew: false },
  ],
  [
    "deprecated keeps isNew from flowStatus",
    { flowStatus: "beta, new", deprecated: "gone soon" },
    { level: "deprecated", isNew: true },
  ],
  [
    "unrelated tags ignored",
    { "flr-generate": "all", foo: "bar" },
    { level: "stable", isNew: false },
  ],
] as const)("%s", (_desc, tags, expected) => {
  expect(deriveComponentStatus(tags)).toEqual(expected);
});
