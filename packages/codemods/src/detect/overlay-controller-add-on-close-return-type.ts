import { tsExtensions } from "../checks/context.js";
import type { Detector } from "../checks/types.js";

/**
 * Translated from the catalogue's `detect: rg -t ts 'addOnClose|addOnOpen'`.
 * Every call site needs a by-hand look at its handler — see
 * `src/verify/overlay-controller-add-on-close-return-type.ts` for why no
 * compiler check can narrow this list further.
 */
export const detector: Detector = {
  detect: (context) => context.search(/addOnClose|addOnOpen/, tsExtensions),
};
