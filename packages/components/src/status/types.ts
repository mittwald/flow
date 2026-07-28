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
}

/** Flat map keyed by component display name. Complete: every component listed. */
export type FlowComponentStatusRegistry = Record<string, FlowComponentStatus>;
