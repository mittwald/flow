/*
 * An *augmentation*, which is why the import is there: `declare module` in a
 * file with no imports or exports is an ambient declaration and would replace
 * `vitest/browser`'s own typings rather than add to them — `page`, `commands`
 * and `userEvent` all disappear.
 */
import "vitest/browser";

declare module "vitest/browser" {
  interface BrowserCommands {
    /** Writes a scenario's host DOM for the Svelte run to compare against. */
    writeCorpusReference: (key: string, content: string) => Promise<void>;
    readCorpusReference: (key: string) => Promise<string | null>;
  }
}
