import type { Verifier } from "../checks/types.js";

/**
 * Shape "typecheck alone suffices" (~3 of the 23 entries). Translated from the
 * catalogue's own verify prose: "tsc --noEmit passes — a numeric `delay` is a
 * type error, so no separate `rg` check is needed." There is nothing for
 * `search` to run here — a residual numeric literal is a type-level fact, not a
 * decidable text pattern — so this always returns `ok: true` and leans on the
 * hint. That is not "done": the compiler run itself is outside what this
 * package executes (no subprocess), so it stays a person's job.
 */
export const verifier: Verifier = {
  description:
    "The type change alone catches this; `tsc --noEmit` is the whole check.",
  verify: async () => ({
    ok: true,
    findings: [],
    hints: [
      'Run `tsc --noEmit` — a numeric `delay` on `TooltipTrigger` is a type error under the new signature (only `"default"` and `"long"` are accepted), so a clean typecheck is sufficient on its own.',
    ],
  }),
};
