/**
 * Per-component lifecycle status (ADR 0003). The `level` ladder is mutually
 * exclusive; `isNew` is an orthogonal flag that can accompany any level.
 * `stable` is the default for unannotated components.
 */
export type FlowComponentStatusLevel = "beta" | "stable" | "deprecated";

export interface FlowComponentStatus {
  level: FlowComponentStatusLevel;
  isNew: boolean;
}

/** Flat map keyed by component display name. Complete: every component listed. */
export type FlowComponentStatusRegistry = Record<string, FlowComponentStatus>;
