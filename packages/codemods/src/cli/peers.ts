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
 *
 * Both lists are labelled, even when only one is present. An unlabelled list
 * with a marker appended somewhere would leave the reader guessing how far the
 * marker reaches — and "does this project actually need react?" is the whole
 * question this output exists to answer.
 */
const renderRequirement = (
  { peer, range, requiredBy, optionalFor }: PeerRequirement,
  width: number,
  paint: Painter,
): string => {
  const gutter = indent.repeat(2);
  const required = requiredBy.length > 0;

  // The status sits on the peer line, in colour, because it answers the
  // question the reader actually has — "must I install this at all?" — and one
  // package requiring it settles that no matter how many others call it
  // optional. Underneath everything is dim, so each entry has exactly one
  // bright thing to land on when scanning.
  const status = required ? paint.yellow("required") : paint.dim("optional");

  // Only a disagreement earns the two labelled lines. Where every package
  // treats the peer the same way, the labels would repeat what the status
  // already said, once per entry, for the whole list.
  const rows: readonly (readonly [string, string[]])[] =
    required && optionalFor.length > 0
      ? [
          ["required by ", requiredBy],
          ["optional for ", optionalFor],
        ]
      : [["", required ? requiredBy : optionalFor]];

  const askers = rows
    .flatMap(([label, names]) =>
      wrap(
        `${label}${names.join(", ")}`,
        Math.max(width - gutter.length, 20),
      ).map((line) => `${gutter}${paint.dim(line)}`),
    )
    .join("\n");

  return `${indent}${paint.bold(peer)} ${paint.code(range)} — ${status}\n${askers}`;
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
            "Ranges as Flow declares them, not a check of what you have installed — your package manager decides that during the install. An optional peer need not be installed at all; it only has to match the range if it is.",
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
