/*
 * Server-safe barrel: it deliberately does not re-export `appShellComponents`.
 * That map imports the shells, whose modules call client-only APIs while they
 * evaluate — a server component that only wants a shell's name would fail the
 * build over a re-export it never touches. Import the map from
 * `./appShellComponents` directly, from a client component.
 */
export { AppShellPreview } from "./AppShellPreview";
export type {
  AppShellPreviewProps,
  AppShellSourceFile,
} from "./AppShellPreview";
export type { AppShellName } from "./appShellCatalogue";
export {
  appShellNames,
  appShellPreviewPath,
  appShellTitles,
  isAppShellName,
} from "./appShellCatalogue";
