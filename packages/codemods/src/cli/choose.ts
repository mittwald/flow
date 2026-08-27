import type { CatalogEntry } from "../catalog/entries.js";

export interface CreateChooseInput {
  /** `-y` — accept every default. */
  yes: boolean;
  /** Whether stdin is a TTY. */
  isTTY: boolean;
  /** Resolves to the ids the user picked. */
  prompt: (entries: CatalogEntry[]) => Promise<string[]>;
}

/**
 * Which codemods to run — interactively, or with everything passed through.
 *
 * `-y` and a non-TTY stdin both skip the prompt: an agent or CI run has nobody
 * to answer it. `CI` is checked too, on top of `isTTY` — a `docker run -t`
 * allocates a TTY with nobody watching it, so the environment variable is what
 * actually distinguishes a human from an unattended runner there.
 */
export const createChoose = ({
  yes,
  isTTY,
  prompt,
}: CreateChooseInput): ((
  entries: CatalogEntry[],
) => Promise<CatalogEntry[]>) => {
  const interactive = !yes && isTTY && process.env.CI === undefined;

  return async (entries) => {
    if (!interactive || entries.length === 0) {
      return entries;
    }
    const ids = await prompt(entries);
    return entries.filter((entry) => ids.includes(entry.id));
  };
};
