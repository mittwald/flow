import { tsExtensions } from "../checks/context.js";
import type { Detector } from "../checks/types.js";

/**
 * Translated from the catalogue's `detect: rg -t ts '\bAlign(Props)?\b'` — see
 * the translation rule in the plan: `rg -t ts 'PATTERN'` becomes
 * `search(/PATTERN/, tsExtensions)`.
 */
export const detector: Detector = {
  detect: (context) => context.search(/\bAlign(Props)?\b/, tsExtensions),
};
