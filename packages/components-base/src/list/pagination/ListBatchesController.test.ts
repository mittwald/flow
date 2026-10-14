import { describe, expect, test } from "vitest";
import { ListBatchesController } from "./ListBatchesController";
import { fakePaginationContext } from "../testing/fakePaginationContext";

const letters = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => `item-${i}`);

describe("client-side paging", () => {
  test("shows one batch and grows the page instead of moving it", () => {
    const context = fakePaginationContext({ rows: letters(50), pageSize: 10 });
    const batches = new ListBatchesController(context, { batchSize: 10 });

    expect(batches.getVisibleItemsCount()).toBe(10);

    batches.nextBatch();

    /*
     * The page gets bigger, it does not advance: everything loaded so far
     * stays on screen, which is what "show next batch" means in this list.
     */
    expect(context.pagination).toEqual({ pageIndex: 0, pageSize: 20 });
    expect(batches.getVisibleItemsCount()).toBe(20);
  });

  test("counts the filtered rows, not the loaded ones", () => {
    const context = fakePaginationContext({ rows: letters(7), rowCount: 999 });
    const batches = new ListBatchesController(context);

    expect(batches.getTotalItemsCount()).toBe(7);
  });

  test("has no next batch once the page covers everything", () => {
    const context = fakePaginationContext({ rows: letters(15), pageSize: 10 });
    const batches = new ListBatchesController(context, { batchSize: 10 });

    expect(batches.hasNextBatch()).toBe(true);
    batches.nextBatch();
    expect(batches.hasNextBatch()).toBe(false);
  });
});

describe("server-side paging", () => {
  const manual = { manualPagination: true, manualFiltering: true };

  test("advances the page index so the next request asks for the next offset", () => {
    const context = fakePaginationContext({
      rows: letters(10),
      rowCount: 100,
      pageSize: 10,
      loader: manual,
    });
    const batches = new ListBatchesController(context, { batchSize: 10 });

    batches.nextBatch();

    expect(context.pagination).toEqual({ pageIndex: 1, pageSize: 10 });
    expect(batches.getBatchIndex()).toBe(1);
  });

  test("takes the total from the server, not from the rows it has", () => {
    const context = fakePaginationContext({
      rows: letters(10),
      rowCount: 100,
      loader: manual,
    });
    const batches = new ListBatchesController(context);

    expect(batches.getTotalItemsCount()).toBe(100);
    expect(batches.hasNextBatch()).toBe(true);
  });
});

describe("reset", () => {
  test("goes back to the first batch", () => {
    const context = fakePaginationContext({ rows: letters(50), pageSize: 10 });
    const batches = new ListBatchesController(context, { batchSize: 10 });

    batches.nextBatch();
    batches.reset();

    expect(context.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
  });

  test("drops the server's total, because it described the old query", () => {
    const context = fakePaginationContext({
      rowCount: 100,
      loader: { manualPagination: true, manualFiltering: true },
    });
    const batches = new ListBatchesController(context);

    batches.reset();

    expect(context.rowCount).toBe(0);
  });

  test("keeps the total when the table does the filtering itself", () => {
    const context = fakePaginationContext({ rows: letters(50) });
    const batches = new ListBatchesController(context);

    batches.reset();

    expect(context.setOptionsCalls).toBe(0);
  });
});
