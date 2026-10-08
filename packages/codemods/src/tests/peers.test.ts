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

/**
 * A package whose peers are written as plain ranges, with `optional!` as the
 * opt-in marker — the fixtures stay readable while every declaration still
 * carries the flag the production type demands.
 */
const pkg = (
  name: string,
  peerDependencies: Record<string, Record<string, string>>,
): PackageVersions => ({
  name,
  versions: Object.keys(peerDependencies),
  distTags: {},
  peerDependencies: Object.fromEntries(
    Object.entries(peerDependencies).map(([version, peers]) => [
      version,
      Object.fromEntries(
        Object.entries(peers).map(([peer, range]) => [
          peer,
          {
            range: range.replace(/^optional!/, ""),
            optional: range.startsWith("optional!"),
          },
        ]),
      ),
    ]),
  ),
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
        optionalFor: [],
      },
      {
        peer: "react-hook-form",
        range: "^7.65.0",
        requiredBy: ["@mittwald/flow-react-components"],
        optionalFor: [],
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
        optionalFor: [],
      },
      {
        peer: "react",
        range: "^19.2.0",
        requiredBy: ["@mittwald/ext-bridge"],
        optionalFor: [],
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
      {
        peer: "react",
        range: "^19.2.0",
        requiredBy: ["@mittwald/ext-bridge"],
        optionalFor: [],
      },
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

  describe("optionality", () => {
    test("is recorded per package, not per range", () => {
      // The real 1.2.2 shape: flow-react-components requires react,
      // ext-bridge marks the identical range optional.
      const summary = collectPeers(
        [
          pkg("@mittwald/flow-react-components", {
            "1.2.0": { react: "^19.2.0" },
          }),
          pkg("@mittwald/ext-bridge", {
            "1.2.0": { react: "optional!^19.2.0" },
          }),
        ],
        "1.2.0",
        flowPackages,
      );

      expect(summary.external).toEqual([
        {
          peer: "react",
          range: "^19.2.0",
          requiredBy: ["@mittwald/flow-react-components"],
          optionalFor: ["@mittwald/ext-bridge"],
        },
      ]);
    });

    test("a peer every package marks optional has no requiredBy at all", () => {
      const summary = collectPeers(
        [
          pkg("@mittwald/flow-react-components", {
            "1.2.0": { next: "optional!^16.2.3" },
          }),
        ],
        "1.2.0",
        flowPackages,
      );

      expect(summary.external).toEqual([
        {
          peer: "next",
          range: "^16.2.3",
          requiredBy: [],
          optionalFor: ["@mittwald/flow-react-components"],
        },
      ]);
    });
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
          optionalFor: [],
        },
      ]);
      // Reported once, in one place — never also as an external peer.
      expect(summary.external).toEqual([]);
    });

    test("a prerelease target accepts a wildcard pin — #3059 review", () => {
      // Without `includePrerelease`, semver says a prerelease satisfies no
      // non-prerelease range at all, `*` included. `next` and `experimental`
      // are prerelease dist-tags, so this reported a publish hole for the
      // historical pin shape on every prerelease upgrade.
      const summary = collectPeers(
        [
          pkg("@mittwald/flow-remote-core", {
            "0.2.0-alpha.103": { "@mittwald/ext-bridge": "*" },
          }),
        ],
        "0.2.0-alpha.103",
        flowPackages,
      );

      expect(summary.flowPins).toEqual([]);
    });

    test("a cross-version pin is still reported at a prerelease target", () => {
      // The fix must not silence the real signal: the published history holds
      // 2253 entries of this shape, e.g. flow-remote-core@0.2.0-alpha.700
      // peering on ext-bridge@0.2.0-alpha.699.
      const summary = collectPeers(
        [
          pkg("@mittwald/flow-remote-core", {
            "0.2.0-alpha.700": { "@mittwald/ext-bridge": "0.2.0-alpha.699" },
          }),
        ],
        "0.2.0-alpha.700",
        flowPackages,
      );

      expect(summary.flowPins).toEqual([
        {
          peer: "@mittwald/ext-bridge",
          range: "0.2.0-alpha.699",
          requiredBy: ["@mittwald/flow-remote-core"],
          optionalFor: [],
        },
      ]);
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

  test("puts required/optional on the peer line, where it is scanned", () => {
    const rendered = renderPeers({
      summary: collectPeers(
        [
          pkg("@mittwald/flow-react-components", {
            "1.2.0": { react: "^19.2.0", next: "optional!^16.2.3" },
          }),
          pkg("@mittwald/ext-bridge", {
            "1.2.0": { react: "optional!^19.2.0" },
          }),
        ],
        "1.2.0",
        flowPackages,
      ),
      target: "1.2.0",
    });

    // One package requiring it settles the question, however many others call
    // it optional — so the mixed peer reads "required" and breaks the two
    // sides out underneath.
    expect(rendered).toContain("react ^19.2.0 — required");
    expect(rendered).toContain("required by @mittwald/flow-react-components");
    expect(rendered).toContain("optional for @mittwald/ext-bridge");

    // Where every package agrees, the status alone carries it and the labels
    // would just repeat themselves once per entry.
    expect(rendered).toMatch(
      /next \^16\.2\.3 — optional\n\s+@mittwald\/flow-react-components/,
    );
    expect(rendered).not.toMatch(/next[^\n]*\n\s+(required by|optional for)/);
  });

  test("colours the required marker and leaves optional dim", () => {
    const coloured = renderPeers({
      summary: collectPeers(
        [
          pkg("@mittwald/flow-react-components", {
            "1.2.0": { react: "^19.2.0", next: "optional!^16.2.3" },
          }),
        ],
        "1.2.0",
        flowPackages,
      ),
      target: "1.2.0",
      color: true,
    });

    const esc = String.fromCharCode(27);
    // Yellow is this renderer's "your attention is needed" tone, the same one
    // the by-hand migration list uses.
    expect(coloured).toContain(`${esc}[33mrequired${esc}[39m`);
    expect(coloured).toContain(`${esc}[2moptional${esc}[22m`);
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
