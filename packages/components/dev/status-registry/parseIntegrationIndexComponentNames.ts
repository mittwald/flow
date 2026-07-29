export interface ParsedIntegrationExport {
  name: string;
  sourceRoot: string;
}

/**
 * Parses an integration entry's `index.ts` into `{ name, sourceRoot }` pairs.
 * `export * from "./…"` and named `export { … }` are the entry's own components
 * (sourceRoot = `entryDir`); `export * from "@/components/X"` re-exports a core
 * component (sourceRoot = `src/components`). `export type * from` and `type X`
 * members are skipped. Non-components (hooks, classes, helpers) are removed
 * later by the doc-properties intersection. Order preserved, duplicates
 * dropped.
 */
export const parseIntegrationIndexComponentNames = (
  source: string,
  entryDir: string,
): ParsedIntegrationExport[] => {
  const result: ParsedIntegrationExport[] = [];
  const seen = new Set<string>();
  const add = (name: string, sourceRoot: string) => {
    if (name && !seen.has(name)) {
      seen.add(name);
      result.push({ name, sourceRoot });
    }
  };

  const wildcard = /export\s*\*\s*from\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = wildcard.exec(source)) !== null) {
    const importPath = match[1] ?? "";
    const name = importPath.split("/").pop() ?? "";
    const sourceRoot = importPath.startsWith("@/components/")
      ? "src/components"
      : entryDir;
    add(name, sourceRoot);
  }

  const block = /export\s*\{([\s\S]*?)\}\s*from\s*"[^"]+"/g;
  while ((match = block.exec(source)) !== null) {
    const members = match[1] ?? "";
    for (const raw of members.split(",")) {
      const token = raw.trim();
      if (!token || token.startsWith("type ")) {
        continue;
      }
      const name = token
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name) {
        add(name, entryDir);
      }
    }
  }

  return result;
};
