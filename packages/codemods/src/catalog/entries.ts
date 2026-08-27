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
