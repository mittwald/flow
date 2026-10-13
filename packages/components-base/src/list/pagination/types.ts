/**
 * Which of the table's jobs the data source does itself.
 *
 * A list either hands TanStack all the rows and lets it paginate, filter and
 * sort them, or it asks a server for one page at a time. Every count and every
 * "is there more" answer differs between the two, which is why the batches
 * controller needs them — and why it takes only these three, not the loader
 * that computes them.
 */
export interface ListLoaderModes {
  readonly manualPagination: boolean;
  readonly manualFiltering: boolean;
  readonly manualSorting: boolean;
}

export interface ListBatchesControllerShape {
  batchSize?: number;
}
