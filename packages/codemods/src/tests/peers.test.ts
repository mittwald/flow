import { describe, expect, test } from "vitest";
import { renderPeers } from "../cli/peers";
import { collectPeers, hasPeers } from "../resolve/peers";
import type { PackageVersions } from "../resolve/registry";

const flowPackages = [
  "@mittwald/flow-react-components",
  "@mittwald/flow-remote-core",
  "@mittwald/ext-bridge",
  "@mittwald/flow-icons",
];

const pkg = (
  name: string,
  peerDependencies: Record<string, Record<string, string>>,
): PackageVersions => ({
  name,
  versions: Object.keys(peerDependencies),
  distTags: {},
  peerDependencies,
});

describe("collectPeers", () => {
  test("groups one range across every package that states it", () => {
    const summary = collectPeers(
      [
        pkg("@mittwald/ext-bridge", { "1.2.0": { react: "^19.2.0" } }),
        pkg("@mittwald/flow-icons", { "1.2.0": { react: "^19.2.0" } }),
        pkg("@mittwald/flow-react-components", {
          "1.2.0": { react: "^19.2.0", "react-hook-form": "^7.65.0" },
        }),
      ],
      "1.2.0",
      flowPackages,
    );

    expect(summary.external).toEqual([
      {
        peer: "react",
        range: "^19.2.0",
        requiredBy: [
          "@mittwald/ext-bridge",
          "@mittwald/flow-icons",
          "@mittwald/flow-react-components",
        ],
      },
      {
        peer: "react-hook-form",
        range: "^7.65.0",
        requiredBy: ["@mittwald/flow-react-components"],
      },
    ]);
    expect(summary.flowPins).toEqual([]);
  });

  test("a disagreement on the same peer stays two entries", () => {
    const summary = collectPeers(
      [
        pkg("@mittwald/ext-bridge", { "1.2.0": { react: "^19.2.0" } }),
        pkg("@mittwald/flow-icons", { "1.2.0": { react: "^18.0.0" } }),
      ],
      "1.2.0",
      flowPackages,
    );

    expect(summary.external).toEqual([
      {
        peer: "react",
        range: "^18.0.0",
        requiredBy: ["@mittwald/flow-icons"],
      },
      {
        peer: "react",
        range: "^19.2.0",
        requiredBy: ["@mittwald/ext-bridge"],
      },
    ]);
  });

  test("reads the target's peers, not another version's", () => {
    const summary = collectPeers(
      [
        pkg("@mittwald/ext-bridge", {
          "1.0.0": { react: "^18.0.0" },
          "1.2.0": { react: "^19.2.0" },
        }),
      ],
      "1.2.0",
      flowPackages,
    );

    expect(summary.external).toEqual([
      { peer: "react", range: "^19.2.0", requiredBy: ["@mittwald/ext-bridge"] },
    ]);
  });

  test("a package that never published the target contributes nothing", () => {
    const summary = collectPeers(
      [pkg("@mittwald/ext-bridge", { "1.0.0": { react: "^18.0.0" } })],
      "1.2.0",
      flowPackages,
    );

    expect(hasPeers(summary)).toBe(false);
  });

  describe("Flow-internal pins", () => {
    test("the pin naming the target is dropped as noise", () => {
      const summary = collectPeers(
        [
          pkg("@mittwald/flow-remote-core", {
            "1.2.0": { "@mittwald/flow-react-components": "1.2.0" },
          }),
        ],
        "1.2.0",
        flowPackages,
      );

      expect(summary.external).toEqual([]);
      expect(summary.flowPins).toEqual([]);
    });

    test("a range the target satisfies is dropped too", () => {
      const summary = collectPeers(
        [
          pkg("@mittwald/flow-remote-core", {
            "1.2.0": { "@mittwald/flow-react-components": "^1.1.0" },
          }),
        ],
        "1.2.0",
        flowPackages,
      );

      expect(summary.flowPins).toEqual([]);
    });

    test("a pin pointing elsewhere is reported — #2887's publish hole", () => {
      const summary = collectPeers(
        [
          pkg("@mittwald/flow-remote-core", {
            "1.2.0": { "@mittwald/flow-react-components": "1.1.9" },
          }),
        ],
        "1.2.0",
        flowPackages,
      );

      expect(summary.flowPins).toEqual([
        {
          peer: "@mittwald/flow-react-components",
          range: "1.1.9",
          requiredBy: ["@mittwald/flow-remote-core"],
        },
      ]);
      // Reported once, in one place — never also as an external peer.
      expect(summary.external).toEqual([]);
    });

    test("an unparseable range is reported rather than judged", () => {
      const summary = collectPeers(
        [
          pkg("@mittwald/flow-remote-core", {
            "1.2.0": { "@mittwald/flow-react-components": "workspace:*" },
          }),
        ],
        "1.2.0",
        flowPackages,
      );

      expect(summary.flowPins).toHaveLength(1);
    });
  });
});

describe("renderPeers", () => {
  const summary = collectPeers(
    [
      pkg("@mittwald/ext-bridge", {
        "1.2.0": { react: "^19.2.0", i18next: "^26.0.0" },
      }),
      pkg("@mittwald/flow-icons", { "1.2.0": { react: "^19.2.0" } }),
    ],
    "1.2.0",
    flowPackages,
  );

  test("names every package behind a range, which the package manager does not", () => {
    const rendered = renderPeers({ summary, target: "1.2.0" });

    expect(rendered).toContain("react ^19.2.0");
    expect(rendered).toContain("@mittwald/ext-bridge, @mittwald/flow-icons");
    expect(rendered).toContain("i18next ^26.0.0");
    expect(rendered).toContain("1.2.0");
  });

  test("says it is not a check, so silence is not read as a pass", () => {
    const rendered = renderPeers({ summary, target: "1.2.0" });

    expect(rendered).toMatch(/not a check of what you have installed/i);
    expect(rendered).toMatch(/package manager/i);
  });

  test("an empty summary renders nothing at all", () => {
    expect(
      renderPeers({
        summary: { external: [], flowPins: [] },
        target: "1.2.0",
      }),
    ).toBe("");
  });

  test("a mismatched Flow pin gets its own section naming #2887", () => {
    const rendered = renderPeers({
      summary: collectPeers(
        [
          pkg("@mittwald/flow-remote-core", {
            "1.2.0": { "@mittwald/flow-react-components": "1.1.9" },
          }),
        ],
        "1.2.0",
        flowPackages,
      ),
      target: "1.2.0",
    });

    expect(rendered).toContain("#2887");
    expect(rendered).toContain("@mittwald/flow-react-components 1.1.9");
  });

  test("colour is off unless asked for", () => {
    const plain = renderPeers({ summary, target: "1.2.0" });
    const coloured = renderPeers({ summary, target: "1.2.0", color: true });

    expect(plain).not.toContain(String.fromCharCode(27));
    expect(coloured).toContain(String.fromCharCode(27));
  });
});
