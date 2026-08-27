import type { Verifier } from "../checks/types.js";

/**
 * Shape "residual pattern + typecheck" (~14 of the 23 entries). Translated from
 * the catalogue's own verify prose: "tsc --noEmit passes, and `rg '\bAlign\b'`
 * finds no Flow import." The pattern half is decidable — `search` runs it — the
 * typecheck half is not (this package wraps no subprocess), so it stays a
 * hint.
 */
export const verifier: Verifier = {
  description:
    "No `Align` left to rename, plus the `tsc --noEmit` reminder for the type change.",
  verify: async (context) => {
    // Unrestricted extensions, translated from `rg '\bAlign\b'` (no `-t ts`):
    // the codemod also rewrites the CSS class name and component tokens, so a
    // residual `Align` can show up outside a `.ts`/`.tsx` file too.
    const findings = await context.search(/\bAlign\b/);
    return {
      ok: findings.length === 0,
      findings,
      hints: [
        "Run `tsc --noEmit` too: `Align`/`AlignProps` still resolve (this rename is a deprecation, not a removal), so a missed usage does not fail to compile — the residual-usage search is the real check for that, not the type check.",
      ],
    };
  },
};
