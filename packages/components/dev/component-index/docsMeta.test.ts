import { expect, test } from "vitest";
import { docsMeta } from "./docsMeta";

const meta = docsMeta("@mittwald/flow-react-components", "1.0.0");

test("the template rule comes before the docs and the components", () => {
  expect(Object.keys(meta)).toEqual([
    "package",
    "version",
    "instructions",
    "docs",
  ]);
  expect(meta.instructions.templates).toContain(
    "Building a new app, page or flow: pick the matching template",
  );
});

test("the lookup hint points back to the rule", () => {
  expect(meta.docs.note).toMatch(/^Follow `instructions`/);
});
