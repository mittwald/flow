import { satisfies, validRange } from "semver";
import type { PackageVersions } from "./registry.js";

/** One peer range, and every Flow package that states it. */
export interface PeerRequirement {
  /** The peer package, e.g. `react`. */
  peer: string;
  /** The range, exactly as the Flow packages authored it. */
  range: string;
  /** The declared Flow dependencies stating it, sorted. */
  requiredBy: string[];
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
   * is a pin pointing somewhere else: with the publish holes of #2887 it can
   * name a version its peer never published, and nothing else in the output
   * would say so.
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
 */
const expectedFlowPin = (range: string, target: string): boolean =>
  validRange(range) !== null && satisfies(target, range);

/**
 * What the declared Flow dependencies require of their peers at `target`.
 *
 * Grouped by peer **and** range, not by peer alone: two Flow packages asking
 * for different ranges of the same peer is precisely what a consumer needs to
 * see, and collapsing them would hide it.
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
    for (const [peer, range] of Object.entries(peers)) {
      // Keyed on both halves, so the two sides of a disagreement survive as
      // two entries. JSON rather than a joined string: no separator to pick
      // that a package name or a range could contain.
      const key = JSON.stringify([peer, range]);
      const existing = grouped.get(key);
      if (existing === undefined) {
        grouped.set(key, { peer, range, requiredBy: [pkg.name] });
      } else {
        existing.requiredBy.push(pkg.name);
      }
    }
  }

  const sorted = [...grouped.values()]
    .map((requirement) => ({
      ...requirement,
      requiredBy: [...requirement.requiredBy].sort(),
    }))
    .sort(
      (a, b) => a.peer.localeCompare(b.peer) || a.range.localeCompare(b.range),
    );

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
