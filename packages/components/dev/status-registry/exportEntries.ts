/**
 * The component-bearing public export entries of
 * `@mittwald/flow-react-components`. Asset/tooling entries (`./internal`,
 * `./all.css`, `./doc-properties`) are not listed — they export no components.
 * `indexFile` is the source parsed for the entry's exported names; `sourceRoot`
 * is the path fragment its components' source files live under (used to
 * disambiguate same-named components across entries).
 */
export interface StatusExportEntry {
  key: string;
  indexFile: string;
  sourceRoot: string;
}

export const STATUS_EXPORT_ENTRIES: StatusExportEntry[] = [
  {
    key: ".",
    indexFile: "src/components/public.ts",
    sourceRoot: "src/components",
  },
  {
    key: "./flr-universal",
    indexFile: "src/index/flr-universal.ts",
    sourceRoot: "src/components",
  },
  {
    key: "./nextjs",
    indexFile: "src/integrations/nextjs/index.ts",
    sourceRoot: "src/integrations/nextjs",
  },
  {
    key: "./react-hook-form",
    indexFile: "src/integrations/react-hook-form/index.ts",
    sourceRoot: "src/integrations/react-hook-form",
  },
  {
    key: "./password-tools",
    indexFile: "src/integrations/@mittwald/password-tools-js/index.ts",
    sourceRoot: "src/integrations/@mittwald/password-tools-js",
  },
];

/** Public import specifier for an `exports` key: `.` → name, `./x` → `name/x`. */
export const specifierOf = (key: string, packageName: string): string =>
  key === "." ? packageName : `${packageName}${key.slice(1)}`;
