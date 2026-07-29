/**
 * Extracts the component value-exports of `src/index/flr-universal.ts` — the
 * identifiers in every `export { … } from "…"` block, skipping `type X` members
 * and `export *` lines (icons / lib re-exports). Non-component identifiers that
 * slip through (e.g. `typedList`) are dropped later by the doc-properties
 * intersection and the PascalCase predicate.
 */
export const parseFlrUniversalComponentNames = (
  source: string,
): Set<string> => {
  const names = new Set<string>();
  const block = /export\s*\{([\s\S]*?)\}\s*from\s*"[^"]+"/g;
  let match: RegExpExecArray | null;
  while ((match = block.exec(source)) !== null) {
    const members = match[1] ?? "";
    for (const raw of members.split(",")) {
      const token = raw.trim();
      if (!token || token.startsWith("type ")) {
        continue;
      }
      // `A as B` re-exports B; a plain `A` re-exports A.
      const name = token
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name) {
        names.add(name);
      }
    }
  }
  return names;
};
