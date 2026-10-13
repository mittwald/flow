/**
 * The development entry Next's compiler imports (`jsx-dev-runtime`), which is
 * the same runtime — the extra arguments a dev transform passes (source
 * location, `self`) are not used.
 */
export { jsx, jsx as jsxDEV, jsxs, Fragment } from "./jsx-runtime";
/* A namespace is types only, so it re-exports as one under `verbatimModuleSyntax`. */
export type { JSX } from "./jsx-runtime";
