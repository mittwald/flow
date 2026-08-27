import { describe, expect, test } from "vitest";
import {
  applyTarget,
  detectCurrentVersion,
  findFlowDependencies,
  rewriteRange,
} from "../manifest";

const flowPackages = [
  "@mittwald/flow-react-components",
  "@mittwald/flow-icons-pro",
  "@mittwald/ext-bridge",
];

const manifest = {
  name: "consumer",
  dependencies: {
    "@mittwald/flow-react-components": "^1.0.1",
    "@mittwald/flow-icons-pro": "1.0.1",
    react: "^19.2.0",
  },
  devDependencies: { "@mittwald/ext-bridge": "~1.0.1" },
};

describe("findFlowDependencies", () => {
  test("finds Flow packages across dependency fields and ignores others", () => {
    expect(findFlowDependencies(manifest, flowPackages)).toEqual([
      {
        field: "dependencies",
        name: "@mittwald/flow-react-components",
        range: "^1.0.1",
      },
      {
        field: "dependencies",
        name: "@mittwald/flow-icons-pro",
        range: "1.0.1",
      },
      {
        field: "devDependencies",
        name: "@mittwald/ext-bridge",
        range: "~1.0.1",
      },
    ]);
  });

  test("a manifest without Flow dependencies yields nothing", () => {
    expect(
      findFlowDependencies({ dependencies: { react: "^19" } }, flowPackages),
    ).toEqual([]);
  });
});

describe("rewriteRange", () => {
  test("keeps the range operator", () => {
    expect(rewriteRange("^1.0.1", "1.2.0")).toBe("^1.2.0");
    expect(rewriteRange("~1.0.1", "1.2.0")).toBe("~1.2.0");
    expect(rewriteRange(">=1.0.1", "1.2.0")).toBe(">=1.2.0");
  });

  test("an exact pin stays exact", () => {
    expect(rewriteRange("1.0.1", "1.2.0")).toBe("1.2.0");
  });

  test("a range it cannot read is left alone", () => {
    expect(rewriteRange("workspace:*", "1.2.0")).toBe("workspace:*");
    expect(rewriteRange("*", "1.2.0")).toBe("*");
    expect(rewriteRange("latest", "1.2.0")).toBe("latest");
  });
});

describe("applyTarget", () => {
  test("moves every Flow dependency and leaves the rest untouched", () => {
    const updated = applyTarget(manifest, "1.2.0", flowPackages);
    expect(updated.dependencies).toEqual({
      "@mittwald/flow-react-components": "^1.2.0",
      "@mittwald/flow-icons-pro": "1.2.0",
      react: "^19.2.0",
    });
    expect(updated.devDependencies).toEqual({
      "@mittwald/ext-bridge": "~1.2.0",
    });
  });

  test("does not mutate the input", () => {
    applyTarget(manifest, "1.2.0", flowPackages);
    expect(manifest.dependencies["@mittwald/flow-react-components"]).toBe(
      "^1.0.1",
    );
  });
});

describe("detectCurrentVersion", () => {
  const deps = findFlowDependencies(manifest, flowPackages);

  test("prefers the installed version", () => {
    expect(detectCurrentVersion(deps, () => "1.0.4")).toBe("1.0.4");
  });

  test("falls back to the lowest version the range allows", () => {
    expect(detectCurrentVersion(deps, () => undefined)).toBe("1.0.1");
  });

  test("returns undefined when there is nothing to go on", () => {
    expect(detectCurrentVersion([], () => undefined)).toBeUndefined();
  });
});
