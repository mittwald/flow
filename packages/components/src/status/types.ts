/**
 * Per-component lifecycle status (ADR 0003). The `level` ladder is mutually
 * exclusive; `isNew` is an orthogonal flag that can accompany any level.
 * `stable` is the default for unannotated components.
 *
 * Twin of `DerivedComponentStatusLevel` in
 * `dev/status-registry/deriveComponentStatus.ts` — the `dev`/`src` rootDir
 * split forbids a shared import, so keep both structurally identical.
 */
export type FlowComponentStatusLevel = "beta" | "stable" | "deprecated";

// Twin of `DerivedComponentStatus` in `dev/status-registry/deriveComponentStatus.ts`
// — keep both structurally identical (see note on `FlowComponentStatusLevel` above).
export interface FlowComponentStatus {
  level: FlowComponentStatusLevel;
  isNew: boolean;
  /** Migration text from a component-level `@deprecated` tag (deprecated only). */
  deprecationNotice?: string;
}

/**
 * Flat map of component statuses keyed by **public import specifier**:
 * `"<specifier>#<exportName>"` — e.g.
 * `"@mittwald/flow-react-components#Button"` or
 * `"@mittwald/flow-react-components/nextjs#Link"`. A component exported from
 * several entries appears under one key per specifier.
 */
export type FlowComponentStatusRegistry = Record<string, FlowComponentStatus>;
