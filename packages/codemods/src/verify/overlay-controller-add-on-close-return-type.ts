import type { Verifier } from "../checks/types.js";

/**
 * Shape "a person must judge it" (~6 of the 23 entries). Translated from the
 * catalogue's own verify prose, which says outright that no compiler check
 * catches this: the return type widened from `() => void` to `() => unknown`,
 * so every previous handler stays assignable and `tsc --noEmit` passes
 * unchanged whether or not a handler now vetoes a close/open it never meant to.
 * `ok: true` here means only "nothing this module can decide is wrong" — not
 * that the review happened.
 */
export const verifier: Verifier = {
  verify: async () => ({
    ok: true,
    findings: [],
    hints: [
      "No compiler check catches this: `() => unknown` accepts every previous `addOnClose`/`addOnOpen` handler, so `tsc --noEmit` passes before and after. Review each handler by hand for one that can return `false` — `executeHandlers` now treats that as a veto and cancels the close/open, even for a handler that returned `false` incidentally with no intent to block anything.",
    ],
  }),
};
