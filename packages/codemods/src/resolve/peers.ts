import { satisfies, validRange } from "semver";
import type { PackageVersions } from "./registry.js";

/** One peer range, and how each Flow package that states it treats it. */
export interface PeerRequirement {
  /** The peer package, e.g. `react`. */
  peer: string;
  /** The range, exactly as the Flow packages authored it. */
  range: string;
  /** The declared Flow dependencies that require it, sorted. */
  requiredBy: string[];
  /**
   * The declared Flow dependencies that mark it `optional`, sorted.
   *
   * Separate from `requiredBy` rather than a flag on the requirement, because
   * optionality is **per package**: at 1.2.2 `react ^19.2.0` is required by
   * `flow-react-components` and optional for `ext-bridge`. One line carrying
   * both lists says that; a single boolean would have to pick a side, and
   * either choice is wrong for half the readers.
   */
  optionalFor: string[];
}

export interface PeerSummary {
  /**
   * Everything the Flow packages peer on that is not itself a Flow package —
   * react, react-hook-form, next, i18next and the rest.
   */
  external: PeerRequirement[];
  /**
   * Flow-internal peers the target does **not** satisfy.
   *
   * Flow's internal peers publish as exact pins (`@mittwald/flow-remote-core`
   * peers on `@mittwald/flow-react-components: "1.1.52"`), so the expected case
   * — the pin naming the version being installed — is noise. What is not noise
   * is a pin pointing somewhere else: upgrading every declared package to one
   * target then leaves it unsatisfied, and nothing else in the output says so.
   *
   * This is not hypothetical. Across the published history of the five remote
   * packages, 2253 of 6210 Flow-internal peer entries pin a version other than
   * the one they ship with — e.g. `flow-remote-core@0.2.0-alpha.700` peers on
   * `ext-bridge@0.2.0-alpha.699`.
   *
   * What it usually is **not** is a publish hole. Lerna releases only the
   * packages that changed, so the pin names a neighbouring release that exists:
   * 2207 of those 2253 point at a published version, leaving 46 that are
   * genuinely missing (#2887). The rendered warning leads with the common cause
   * for that reason (#3204 review).
   */
  flowPins: PeerRequirement[];
}

/**
 * Whether a Flow-internal peer pin is the unremarkable one.
 *
 * `satisfies` rather than a string compare, so a genuine range (`^1.1.0`) is as
 * expected as the exact pin the publish pipeline usually writes. An unparseable
 * range — `workspace:*`, from a package resolved straight out of a checkout
 * rather than the registry — is not a claim about `target` at all, so it is
 * reported rather than silently judged.
 *
 * `includePrerelease` is load-bearing, not tidiness: without it a prerelease
 * satisfies **no** non-prerelease range, `*` included. The historical
 * Flow-internal pin _is_ `*` (2328 of 6210 published entries), and `next` and
 * `experimental` are prerelease dist-tags — so every prerelease target reported
 * a publish hole for a pin that accepts everything.
 */
const expectedFlowPin = (range: string, target: string): boolean =>
  validRange(range) !== null &&
  satisfies(target, range, { includePrerelease: true });

/**
 * Ties break on the string, not on the locale.
 *
 * `localeCompare` depends on the runtime's ICU data, which differs between Node
 * builds and would reorder hyphenated names like `react-dom` from one machine
 * to the next — including between a developer's run and CI's.
 */
const byString = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * What the declared Flow dependencies require of their peers at `target`.
 *
 * Grouped by peer **and** range, not by peer alone: two Flow packages asking
 * for different ranges of the same peer is precisely what a consumer needs to
 * see, and collapsing them would hide it. Optionality does **not** split a
 * group — it is recorded per package inside it (see `optionalFor`).
 *
 * Ranges are reported exactly as authored — this never decides whether the
 * project satisfies them. That is the package manager's job, it already does it
 * during the install, and a second opinion here could only drift from the one
 * that actually gates.
 */
export const collectPeers = (
  packages: PackageVersions[],
  target: string,
  flowPackages: string[],
): PeerSummary => {
  const grouped = new Map<string, PeerRequirement>();

  for (const pkg of packages) {
    const peers = pkg.peerDependencies[target] ?? {};
    for (const [peer, { range, optional }] of Object.entries(peers)) {
      // Keyed on both halves, so the two sides of a disagreement survive as
      // two entries. JSON rather than a joined string: no separator to pick
      // that a package name or a range could contain.
      const key = JSON.stringify([peer, range]);
      const existing = grouped.get(key) ?? {
        peer,
        range,
        requiredBy: [],
        optionalFor: [],
      };
      (optional ? existing.optionalFor : existing.requiredBy).push(pkg.name);
      grouped.set(key, existing);
    }
  }

  const sorted = [...grouped.values()]
    .map((requirement) => ({
      ...requirement,
      requiredBy: [...requirement.requiredBy].sort(byString),
      optionalFor: [...requirement.optionalFor].sort(byString),
    }))
    .sort((a, b) => byString(a.peer, b.peer) || byString(a.range, b.range));

  return {
    external: sorted.filter(({ peer }) => !flowPackages.includes(peer)),
    flowPins: sorted.filter(
      ({ peer, range }) =>
        flowPackages.includes(peer) && !expectedFlowPin(range, target),
    ),
  };
};

/** Whether a summary has anything worth printing. */
export const hasPeers = (summary: PeerSummary): boolean =>
  summary.external.length > 0 || summary.flowPins.length > 0;
