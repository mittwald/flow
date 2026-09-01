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

  test("peer and optional dependencies are found too", () => {
    expect(
      findFlowDependencies(
        {
          peerDependencies: { "@mittwald/flow-react-components": "^1.0.1" },
          optionalDependencies: { "@mittwald/flow-icons-pro": "1.0.1" },
        },
        flowPackages,
      ),
    ).toEqual([
      {
        field: "peerDependencies",
        name: "@mittwald/flow-react-components",
        range: "^1.0.1",
      },
      {
        field: "optionalDependencies",
        name: "@mittwald/flow-icons-pro",
        range: "1.0.1",
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

  // The dangerous failure is not "left alone" but "collapsed": a compound or
  // OR range rewritten to a single version would silently narrow what the
  // consumer accepts. Both fail `valid()` on their trailing text, so the whole
  // range is rejected — pin that, because a looser regex would not.
  test("a compound or OR range is never collapsed to one version", () => {
    expect(rewriteRange(">=1.0.0 <2.0.0", "1.2.0")).toBe(">=1.0.0 <2.0.0");
    expect(rewriteRange("1.0.0 || 2.0.0", "1.2.0")).toBe("1.0.0 || 2.0.0");
  });

  test("an x-range is left alone", () => {
    expect(rewriteRange("1.x", "1.2.0")).toBe("1.x");
    expect(rewriteRange("1.2.x", "1.2.0")).toBe("1.2.x");
  });

  // Documented, not accidental: semver treats the `v` prefix as cosmetic, so
  // dropping it changes nothing a resolver sees.
  test("a leading v is normalised away", () => {
    expect(rewriteRange("v1.0.1", "1.2.0")).toBe("1.2.0");
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

  test("an installed version on a later dependency still wins", () => {
    expect(
      detectCurrentVersion(deps, (name) =>
        name === "@mittwald/ext-bridge" ? "1.0.4" : undefined,
      ),
    ).toBe("1.0.4");
  });

  test("an unparseable installed version is skipped, not trusted", () => {
    expect(
      detectCurrentVersion(deps, (name) =>
        name === "@mittwald/flow-react-components" ? "garbage" : "1.0.4",
      ),
    ).toBe("1.0.4");
  });
});
