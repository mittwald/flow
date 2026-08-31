import type { CatalogEntry } from "../catalog/entries.js";

export interface CreateChooseInput {
  /** `-y` — accept every default. */
  yes: boolean;
  /** Whether stdin is a TTY. */
  isTTY: boolean;
  /** Resolves to the ids the user picked. */
  prompt: (entries: CatalogEntry[]) => Promise<string[]>;
  /** Reports that the prompt was cancelled. */
  onCancel: (message: string) => void;
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
  onCancel,
}: CreateChooseInput): ((
  entries: CatalogEntry[],
) => Promise<CatalogEntry[]>) => {
  const interactive = !yes && isTTY && process.env.CI === undefined;

  return async (entries) => {
    if (!interactive || entries.length === 0) {
      return entries;
    }
    let ids: string[];
    try {
      ids = await prompt(entries);
    } catch {
      // Ctrl+C here used to reject straight out of `runUpgrade`, so the last
      // thing the user saw was an inquirer stack trace — after the manifest had
      // been written and the install had run. Those cannot be taken back, so
      // treat the cancel as "no codemods" and let the caller report what did
      // happen. Any prompt failure lands here; none of them is a reason to lose
      // the bump.
      onCancel(
        "Cancelled at the codemod prompt. The dependency bump and the install already happened — no codemods were run.",
      );
      return [];
    }
    return entries.filter((entry) => ids.includes(entry.id));
  };
};
