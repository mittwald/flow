/**
 * Extracts Flow's curated public component names from the source of
 * `src/components/public.ts` — the last path segment of every `export * from
 * "..."` line. This is the hand-maintained public API surface (see
 * components/AGENTS.md). The status registry is scoped to it so that
 * internal/sub-components (badged via their parent) and non-exported helpers
 * are not tracked as independent contract units.
 */
export const parsePublicComponentNames = (
  publicTsSource: string,
): Set<string> => {
  const names = new Set<string>();
  const exportFrom = /export\s+\*\s+from\s+"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = exportFrom.exec(publicTsSource)) !== null) {
    const captured = match[1] ?? "";
    const segments = captured.split("/");
    const last = segments[segments.length - 1];
    if (last) {
      names.add(last);
    }
  }
  return names;
};
