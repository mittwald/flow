import { tsExtensions } from "../checks/context.js";
import type { Detector } from "../checks/types.js";

/**
 * Translated from the catalogue's `detect: rg -t ts 'TooltipTrigger'`. This
 * over-matches on purpose — every `TooltipTrigger` usage, not just the ones
 * with a numeric `delay` — because a regex can't tell a numeric literal from a
 * string one without a full parse; the reader looks at each hit. See
 * `src/verify/tooltip-trigger-delay-type.ts` for why the real check is left to
 * `tsc --noEmit` instead.
 */
export const detector: Detector = {
  description: "Finds `TooltipTrigger` usage, to review its `delay` prop.",
  detect: (context) => context.search(/TooltipTrigger/, tsExtensions),
};
