import type { ListData } from "@/components/List/model/loading/types";
import useSelector from "@/lib/mobx/useSelector";
import type { AsyncResource } from "@mittwald/react-use-promise";
import { action, computed, makeObservable, observable } from "mobx";
import { useStatic } from "@/lib/hooks/useStatic";
import type List from "@/components/List/model/List";
import { uniqueBy } from "remeda";

type AsyncResourceLoadingState = AsyncResource["state"]["value"];
type DataBatches<T> = ListData<T>[];
type BatchesLoadingState = AsyncResourceLoadingState[];

export class IncrementalLoaderState<T> {
  public dataBatches: DataBatches<T> = [];
  public prevDataBatches: DataBatches<T> = [];
  public batchLoadingStates: BatchesLoadingState = ["void"];
  public metadata?: Record<string, unknown> = undefined;
  public readonly list: List<T>;

  private constructor(list: List<T>) {
    this.list = list;
    makeObservable(this, {
      prevDataBatches: false,
      useMergedData: false,
      useIsLoading: false,
      dataBatches: observable.shallow,
      batchLoadingStates: observable.shallow,
      metadata: observable,
      mergedData: computed,
      isLoading: computed,
      reset: action.bound,
      setDataBatch: action.bound,
      setBatchLoadingState: action.bound,
      setMetadata: action.bound,
    });
  }

  public static useNew<T>(list: List<T>): IncrementalLoaderState<T> {
    return useStatic(() => new IncrementalLoaderState<T>(list));
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

  public setBatchLoadingState(
    index: number,
    state: AsyncResourceLoadingState,
  ): void {
    if (this.batchLoadingStates[index] !== state) {
      this.batchLoadingStates[index] = state;
    }
  }

  public setMetadata(metadata?: Record<string, unknown>): void {
    this.metadata = metadata;
  }

  public get mergedData(): T[] {
    const dataBatches =
      this.dataBatches.length === 0 ? this.prevDataBatches : this.dataBatches;

    const merged = dataBatches.flatMap((d) => d);
    if (this.list.getItemId) {
      return uniqueBy(merged, this.list.getItemId);
    } else {
      return merged;
    }
  }

  public useMergedData(): T[] {
    return useSelector(() => this.mergedData, [this.prevDataBatches]);
  }

  public get isLoading(): boolean {
    return this.batchLoadingStates.some((s) => s === "loading" || s === "void");
  }

  public useIsLoading(): boolean {
    return useSelector(() => this.isLoading);
  }

  public isBatchLoaded(batchIndex: number) {
    return batchIndex in this.dataBatches;
  }
}
