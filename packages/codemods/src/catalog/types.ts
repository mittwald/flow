/**
 * When an entry applies.
 *
 * - `migration` — the old path is gone, at runtime or in the types. It only
 *   matters when the consumer actually crosses `since`.
 * - `deprecation` — the old path still works. It matters as soon as the
 *   replacement exists.
 */
export type MigrationKind = "migration" | "deprecation";

/**
 * What has to happen.
 *
 * - `codemod` — `src/migrations/<id>/transform.ts` does it.
 * - `manual` — a person or an agent has to change code.
 * - `none` — behaviour changed, no code change required. An agent needs this
 *   spelled out, or it keeps looking for something to edit.
 */
export type MigrationAction = "codemod" | "manual" | "none";

export interface MigrationEntry {
  /**
   * Dashed and lowercase. Doubles as the `src/migrations/<id>` directory name
   * and, when `action` is `codemod`, that directory's `transform.ts` file, and
   * as the `MIGRATION.md` heading anchor.
   */
  id: string;
  /** The exact version the change shipped in. */
  since: string;
  /** Heading text for the guide. */
  title: string;
  kind: MigrationKind;
  action: MigrationAction;
  /**
   * Whether the entry also applies to `@mittwald/flow-remote-react-components`.
   * Held to that package's real export surface by `remoteScope.test.ts` — do
   * not guess it.
   */
  remotePackage: boolean;
  /** What to change, imperative and specific enough to execute. */
  apply: string;
  /** The guide entry as Markdown. Headings inside it start at level 4. */
  body: string;
}
