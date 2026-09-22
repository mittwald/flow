import type { CSSProperties } from "react";

/**
 * The inline style that carries a popover's `width`.
 *
 * A popover's content wrapper caps itself at a component default —
 * `--coach-mark--max-width`, `--contextual-help--max-width`. That cap shapes a
 * popover nobody sized, but it also outranks a `width`: the box widens while
 * the content stays at the cap, leaving empty background beside it. The
 * wrappers therefore read their cap through `--popover-content-max-width`, and
 * a given width unsets it.
 *
 * The cap on the popover itself stays — that one is the gap to the viewport
 * edge, not a default.
 *
 * @internal
 */
export const popoverWidthStyle = (
  width: string | number | undefined,
): CSSProperties =>
  width === undefined
    ? {}
    : ({
        width,
        "--popover-content-max-width": "none",
      } as CSSProperties);
