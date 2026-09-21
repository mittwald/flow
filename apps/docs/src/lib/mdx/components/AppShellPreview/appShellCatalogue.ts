/**
 * The App Shells, by the `example` name the MDX refers to them with.
 *
 * Server-safe on purpose: it names the shells without importing them. The
 * shells call client-only APIs at module scope (`typedList()`), so the route
 * that renders one can only reach them from a client component — but it still
 * needs the names for `generateStaticParams` and the page title.
 */
const titles = {
  "focus-task": "Focus Task",
  "focus-task-bestellung": "Focus Task – Konfigurations-Aufgabe",
  "simple-app": "Simple App",
  "simple-app-sidebar": "Simple App – Mit seitlicher Navigation",
  "complex-app": "Complex App",
  "complex-app-detail": "Complex App – Detailansicht",
  "complex-app-doku": "Complex App – Doku-Layout",
} as const;

export type AppShellName = keyof typeof titles;

/** Names the shell in the preview link and as the preview page's title. */
export const appShellTitles: Record<AppShellName, string> = titles;

export const appShellNames = Object.keys(titles) as AppShellName[];

export const isAppShellName = (name: string): name is AppShellName =>
  name in titles;

/** Pathname of the standalone page that shows one shell on its own. */
export const appShellPreviewPath = (example: AppShellName): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/app-shell-preview/${example}`;
