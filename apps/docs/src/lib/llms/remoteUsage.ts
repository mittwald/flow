import {
  componentIndex,
  componentIndexEntry,
  type ComponentIndexEntry,
} from "@/lib/componentIndex";

export const APP_PACKAGE = "@mittwald/flow-react-components";
export const REMOTE_PACKAGE = "@mittwald/flow-remote-react-components";

export interface RemoteUsage {
  available: boolean;
  importFrom?: string;
  excludedProps?: string[];
}

/**
 * The remote package mirrors only the root barrel and the react-hook-form
 * entry; everything else it exports (flr-universal included) comes from its
 * root.
 */
const remoteSpecifierOf = (entry: ComponentIndexEntry): string =>
  entry.importFrom.includes(`${APP_PACKAGE}/react-hook-form`)
    ? `${REMOTE_PACKAGE}/react-hook-form`
    : REMOTE_PACKAGE;

export const remoteUsageFromEntry = (
  entry: ComponentIndexEntry,
): RemoteUsage => {
  if (!entry.remote.available) {
    return { available: false };
  }
  return {
    available: true,
    importFrom: remoteSpecifierOf(entry),
    ...(entry.remote.excludedProps
      ? { excludedProps: entry.remote.excludedProps }
      : {}),
  };
};

export const remoteUsageOf = (
  componentName: string,
): RemoteUsage | undefined => {
  const entry = componentIndexEntry(componentName);
  return entry ? remoteUsageFromEntry(entry) : undefined;
};

const code = (value: string): string => `\`${value}\``;

/**
 * Opens a component's Markdown page. The examples below it import from the app
 * package, so an agent writing extension code needs this before it copies one.
 */
export const remoteNoticeMarkdown = (
  componentName: string,
  usage: RemoteUsage,
): string => {
  if (!usage.available) {
    return (
      `> **mStudio-Extensions:** ${code(componentName)} ist in ` +
      `${code(REMOTE_PACKAGE)} nicht verfügbar.`
    );
  }

  const excluded = usage.excludedProps?.length
    ? ` Diese Props kommen remote nicht an: ` +
      `${usage.excludedProps.map(code).join(", ")}.`
    : "";

  return (
    `> **mStudio-Extensions:** Importiere ${code(componentName)} aus ` +
    `${code(usage.importFrom ?? REMOTE_PACKAGE)}. Die Beispiele auf dieser ` +
    `Seite importieren aus ${code(APP_PACKAGE)}, das in einer Extension nicht ` +
    `rendert.${excluded}`
  );
};

/**
 * `Link` alone would be wrong: only the Next.js integration's `Link` is
 * missing.
 */
const displayName = (key: string): string => {
  const separator = key.indexOf("#");
  return separator === -1
    ? code(key)
    : `${code(key.slice(separator + 1))} (${code(key.slice(0, separator))})`;
};

export const componentsWithoutRemote = (): string[] =>
  Object.entries(componentIndex)
    .filter(([, entry]) => !entry.remote.available)
    .map(([key]) => key)
    .sort((a, b) =>
      a.slice(a.indexOf("#") + 1).localeCompare(b.slice(b.indexOf("#") + 1)),
    )
    .map(displayName);
