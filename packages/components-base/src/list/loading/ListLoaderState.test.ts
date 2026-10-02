import { ListLoaderState } from "./ListLoaderState";
import { autorun } from "mobx";
import { describe, expect, test, vi } from "vitest";

interface Pilot {
  id: string;
  name: string;
}

const pilot = (id: string): Pilot => ({ id, name: `Pilot ${id}` });

describe("ListLoaderState", () => {
  test("merges the batches in order", () => {
    const state = new ListLoaderState<Pilot>();

    state.setDataBatch(0, [pilot("a")]);
    state.setDataBatch(1, [pilot("b")]);

    expect(state.mergedData.map((p) => p.id)).toEqual(["a", "b"]);
  });

  /*
   * A paginated loader can hand the same item back in two batches — an item
   * inserted above the offset shifts the page boundary.
   */
  test("drops an item two batches both carry", () => {
    const state = new ListLoaderState<Pilot>({ getItemId: (p) => p.id });

    state.setDataBatch(0, [pilot("a"), pilot("b")]);
    state.setDataBatch(1, [pilot("b"), pilot("c")]);

    expect(state.mergedData.map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  test("keeps duplicates without an id", () => {
    const state = new ListLoaderState<Pilot>();

    state.setDataBatch(0, [pilot("a")]);
    state.setDataBatch(1, [pilot("a")]);

    expect(state.mergedData).toHaveLength(2);
  });

  /*
   * What `prevDataBatches` is for: a filter change resets the batches, and the
   * list keeps showing what it had until the new ones arrive instead of
   * flashing empty.
   */
  test("keeps showing the last data through a reset", () => {
    const state = new ListLoaderState<Pilot>();
    state.setDataBatch(0, [pilot("a")]);

    state.reset();

    expect(state.mergedData.map((p) => p.id)).toEqual(["a"]);

    state.setDataBatch(0, [pilot("b")]);
    expect(state.mergedData.map((p) => p.id)).toEqual(["b"]);
  });

  describe("loading state", () => {
    test("starts loading and stays so until a batch reports", () => {
      const state = new ListLoaderState<Pilot>();

      expect(state.isLoading).toBe(true);
      expect(state.isInitiallyLoading).toBe(true);

      state.setBatchLoadingState(0, "loaded");

      expect(state.isLoading).toBe(false);
      expect(state.isInitiallyLoading).toBe(false);
    });

    test("counts an error as done loading", () => {
      const state = new ListLoaderState<Pilot>();

      state.setBatchLoadingState(0, "error");

      expect(state.isInitiallyLoading).toBe(false);
    });

    /* The footer tells "loading" from "loading more" by this. */
    test("is loading more only once something is there", () => {
      const state = new ListLoaderState<Pilot>();

      state.setBatchLoadingState(0, "loading");
      expect(state.isLoadingMore).toBe(false);

      state.setDataBatch(0, [pilot("a")]);
      expect(state.isLoadingMore).toBe(true);
    });
  });

  /*
   * The contract every binding relies on: the state is observable, so a
   * subscription sees a change without being told about it. React reads it
   * through `useSelector`, Vue through `watchMobxValue`.
   */
  describe("observability", () => {
    test("reports merged data to an observer", () => {
      const state = new ListLoaderState<Pilot>();
      const seen = vi.fn();

      const stop = autorun(() => seen(state.mergedData.length));
      expect(seen).toHaveBeenLastCalledWith(0);

      state.setDataBatch(0, [pilot("a")]);
      expect(seen).toHaveBeenLastCalledWith(1);

      stop();
    });

    test("reports the loading state to an observer", () => {
      const state = new ListLoaderState<Pilot>();
      const seen = vi.fn();

      const stop = autorun(() => seen(state.isLoading));
      expect(seen).toHaveBeenLastCalledWith(true);

      state.setBatchLoadingState(0, "loaded");
      expect(seen).toHaveBeenLastCalledWith(false);

      stop();
    });
  });
});
