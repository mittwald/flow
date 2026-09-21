/**
 * How the list loads the batches after the first one.
 *
 * - `button` — a "Show more" button loads the next batch (today's default).
 * - `infiniteScroll` — every batch loads on scroll (today's `infiniteScroll`).
 * - `scrollThenButton` — the first `autoLoadBatches` batches load without the
 *   user asking, the button takes over afterwards.
 * - `buttonThenScroll` — the first `manualBatches` batches load on button press,
 *   scrolling takes over afterwards.
 * - `growingBatches` — button only, but every batch after the first one loads
 *   `nextBatchSize` items instead of `batchSize`.
 */
export type ListPaginationMode =
  | "button"
  | "infiniteScroll"
  | "scrollThenButton"
  | "buttonThenScroll"
  | "growingBatches";

export interface ListPaginationShape {
  /**
   * The strategy the list follows to load the batches after the first one.
   *
   * @default "button"
   */
  mode?: ListPaginationMode;
  /**
   * How many batches load without the user asking — the initial one included —
   * before the "Show more" button takes over. Only used by `mode:
   * "scrollThenButton"`.
   *
   * @default 3
   */
  autoLoadBatches?: number;
  /**
   * How many batches the user loads by pressing "Show more" before scrolling
   * takes over. Only used by `mode: "buttonThenScroll"`.
   *
   * @default 1
   */
  manualBatches?: number;
  /**
   * The number of items every batch after the first one loads. Only used by
   * `mode: "growingBatches"`.
   *
   * @default batchSize * 3
   */
  nextBatchSize?: number;
}

export interface BatchesControllerShape extends ListPaginationShape {
  batchSize?: number;
}
