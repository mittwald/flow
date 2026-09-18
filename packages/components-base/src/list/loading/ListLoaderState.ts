import type { BatchLoadingState, ListData } from "./types";
import { action, computed, makeObservable, observable } from "mobx";
import { uniqueBy } from "remeda";

export interface ListLoaderStateOptions<T> {
  /**
   * Identifies an item, so the same one loaded in two batches appears once.
   * Without it the batches are concatenated as they arrive.
   */
  getItemId?: (item: T) => string;
}

/**
 * What a list has loaded so far, and how far each batch has got.
 *
 * MobX, and nothing else — no hook, no framework. A binding reads it through
 * its own reactivity: React with `useSelector`, Vue with `watchMobxValue`. That
 * split is the point: the batching, the deduplication and the "still loading"
 * rules are one implementation, and only the subscription is written twice.
 *
 * What is _not_ here is the loading itself. Fetching a batch is
 * `usePromise`/Suspense in React and something else in Vue, so it stays with
 * the binding, and only its outcome is reported here.
 */
export class ListLoaderState<T> {
  public dataBatches: ListData<T>[] = [];
  public batchLoadingStates: BatchLoadingState[] = ["void"];
  public metadata?: unknown = undefined;
  public isInitiallyLoading = true;

  /**
   * The last non-empty result, kept outside MobX on purpose: it exists so a
   * reset can keep rendering the previous data instead of flashing empty, and
   * observing it would make that very reset re-render.
   */
  public prevDataBatches: ListData<T>[] = [];

  private readonly getItemId?: (item: T) => string;

  public constructor(options: ListLoaderStateOptions<T> = {}) {
    this.getItemId = options.getItemId;

    makeObservable(this, {
      prevDataBatches: false,
      dataBatches: observable.shallow,
      batchLoadingStates: observable.shallow,
      metadata: observable,
      mergedData: computed,
      isLoading: computed,
      isLoadingMore: computed,
      isInitiallyLoading: observable,
      setIsInitiallyLoading: action.bound,
      reset: action.bound,
      setDataBatch: action.bound,
      setBatchLoadingState: action.bound,
      setMetadata: action.bound,
    });
  }

  public reset(): void {
    this.batchLoadingStates = [];
    this.dataBatches = [];
  }

  public setDataBatch(index: number, data: ListData<T>): void {
    if (this.dataBatches.length === 0) {
      this.prevDataBatches = [];
    }

    if (this.dataBatches[index] !== data) {
      this.dataBatches[index] = data;
      this.prevDataBatches[index] = data;
    }
  }

  public setBatchLoadingState(index: number, state: BatchLoadingState): void {
    if (state === "error" || state === "loaded") {
      this.setIsInitiallyLoading(false);
    }
    if (this.batchLoadingStates[index] !== state) {
      this.batchLoadingStates[index] = state;
    }
  }

  public setMetadata(metadata?: unknown): void {
    this.metadata = metadata;
  }

  public setIsInitiallyLoading(isInitiallyLoading: boolean): void {
    this.isInitiallyLoading = isInitiallyLoading;
  }

  public get mergedData(): T[] {
    const dataBatches =
      this.dataBatches.length === 0 ? this.prevDataBatches : this.dataBatches;

    const merged = dataBatches.flatMap((d) => d);
    return this.getItemId ? uniqueBy(merged, this.getItemId) : merged;
  }

  public get isLoading(): boolean {
    return this.batchLoadingStates.some((s) => s === "loading" || s === "void");
  }

  public get isLoadingMore(): boolean {
    return this.isLoading && this.dataBatches.length > 0;
  }

  public isBatchLoaded(batchIndex: number): boolean {
    return batchIndex in this.dataBatches;
  }
}

export default ListLoaderState;
