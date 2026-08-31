import { migrations } from "../migrations.generated.js";
import type { MigrationEntry } from "./types.js";

/**
 * A catalogue entry as the CLI sees it — no body.
 *
 * This is the only module that imports the generated file, so nothing else
 * depends on how it is shaped.
 */
export type CatalogEntry = Omit<MigrationEntry, "body">;

export const allEntries: CatalogEntry[] = migrations;

/**
 * Shared refusal for an id that names no codemod — `runSingleCodemod` (against
 * the catalogue) and `runCodemod` (against `src/migrations`/`src/tools` on
 * disk) each hit this independently, so the message is defined once and reused
 * rather than kept in sync by hand in both places.
 */
export const unknownCodemodMessage = (id: string): string =>
  `"${id}" is not a codemod in this package. Run \`flow-codemods list\` to see the available ids.`;
