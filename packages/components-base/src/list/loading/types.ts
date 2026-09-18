/** One batch of list data, as a loader hands it over. */
export type ListData<T> = readonly T[];

/**
 * How far one batch has got.
 *
 * The same four values `@mittwald/react-use-promise` uses, spelled out rather
 * than imported: that package is React's, and this one is the half both
 * bindings share.
 */
export type BatchLoadingState = "void" | "loading" | "loaded" | "error";
