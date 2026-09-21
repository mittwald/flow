import type { PeerRequirement, PeerSummary } from "../resolve/peers.js";
import { hasPeers } from "../resolve/peers.js";
import { painter, wrap, type Painter } from "./text.js";

export interface RenderPeersInput {
  summary: PeerSummary;
  /** The version the ranges were read at. */
  target: string;
  /** Emit ANSI colour. Off by default so a test sees plain text. */
  color?: boolean;
  /** Terminal width to wrap prose to. */
  width?: number;
}

const indent = "  ";

/**
 * One requirement: the peer and its range on top, who asks for it below.
 *
 * The askers go on their own wrapped line rather than trailing the range — at
 * eight Flow packages the list is longer than the range it belongs to, and
 * inline it pushes the next range off the scannable left edge.
 */
const renderRequirement = (
  { peer, range, requiredBy }: PeerRequirement,
  width: number,
  paint: Painter,
): string => {
  const gutter = indent.repeat(2);
  const askers = wrap(
    requiredBy.join(", "),
    Math.max(width - gutter.length, 20),
  )
    .map((line) => `${gutter}${paint.dim(line)}`)
    .join("\n");

  return `${indent}${paint.bold(peer)} ${paint.code(range)}\n${askers}`;
};

/**
 * The peer ranges the Flow packages declare at `target`.
 *
 * Returns `""` when there is nothing to say, so a caller can print it
 * unconditionally.
 *
 * The closing line is not a disclaimer for its own sake: without it the list
 * reads as a check that passed. It is not one — nothing here looks at what the
 * project has installed (see `collectPeers`), and a reader who assumes
 * otherwise would take silence for a green light.
 */
export const renderPeers = ({
  summary,
  target,
  color = false,
  width = 80,
}: RenderPeersInput): string => {
  if (!hasPeers(summary)) {
    return "";
  }

  const paint = painter(color);
  const sections: string[] = [];

  if (summary.external.length > 0) {
    sections.push(
      [
        ...wrap(
          `Peer requirements at ${paint.bold(target)} — what the Flow packages you declare ask of your project:`,
          width,
        ),
        "",
        ...summary.external.map((requirement) =>
          renderRequirement(requirement, width, paint),
        ),
        "",
        ...wrap(
          paint.dim(
            "Ranges as Flow declares them, not a check of what you have installed — your package manager decides that during the install.",
          ),
          width,
        ),
      ].join("\n"),
    );
  }

  if (summary.flowPins.length > 0) {
    sections.push(
      [
        ...wrap(
          paint.yellow(
            `${summary.flowPins.length} Flow-internal peer pin(s) do not accept ${target}. Flow publishes these as exact pins, so this normally means the pinned version was never published (#2887) — install with your package manager's peer diagnostics on before trusting the result.`,
          ),
          width,
        ),
        "",
        ...summary.flowPins.map((requirement) =>
          renderRequirement(requirement, width, paint),
        ),
      ].join("\n"),
    );
  }

  return `${sections.join("\n\n")}\n`;
};
