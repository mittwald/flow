/*
 * Moved whole to `@mittwald/flow-components-base` — nothing about batching is
 * React. What stayed behind is the reset wiring, which is now in `List`: the
 * filters and the search are the list's, not the controller's.
 */
export { ListBatchesController as BatchesController } from "@mittwald/flow-components-base";
