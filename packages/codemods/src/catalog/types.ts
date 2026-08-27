/**
 * When an entry applies.
 *
 * - `migration` — the old path is gone, at runtime or in the types. It only
 *   matters when the consumer actually crosses `since`.
 * - `deprecation` — the old path still works. It matters as soon as the
 *   replacement exists, so `since` is the version that introduced the
 *   replacement, not one that removed anything.
 */
export type MigrationKind = "migration" | "deprecation";

/**
 * What has to happen.
 *
 * - `codemod` — `src/transforms/<id>.ts` does it.
 * - `manual` — a person or an agent has to change code.
 * - `none` — behaviour changed, no code change required. An agent needs this
 *   spelled out, or it keeps looking for something to edit.
 */
export type MigrationAction = "codemod" | "manual" | "none";

export interface MigrationEntry {
  /**
   * Dashed and lowercase. Doubles as the `src/transforms/<id>.ts` file name
   * when `action` is `codemod`, and as the `MIGRATION.md` heading anchor.
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
  /**
   * A shell command that finds affected code. May over-match — the reader looks
   * at the hits. Must not under-match. Omitted only when `action` is `none`.
   */
  detect?: string;
  /** What to change, imperative and specific enough to execute. */
  apply: string;
  /** How to confirm it landed. */
  verify: string;
  /** The guide entry as Markdown. Headings inside it start at level 4. */
  body: string;
}
