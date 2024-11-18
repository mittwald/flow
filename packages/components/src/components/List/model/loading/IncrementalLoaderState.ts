import type { AsyncResource } from "@mittwald/react-use-promise";
import { action, computed, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useRef } from "react";
import type { ListData } from "@/components/List/model/loading/types";

type AsyncResourceLoadingState = AsyncResource["state"]["value"];
type DataBatches<T> = ListData<T>[];
type BatchesLoadingState = AsyncResourceLoadingState[];

export class IncrementalLoaderState<T> {
  public dataBatches: DataBatches<T> = [];
  public prevDataBatches: DataBatches<T> = [];
  public batchLoadingStates: BatchesLoadingState = ["void"];

  private constructor() {
    makeObservable(this, {
      prevDataBatches: false,
      useMergedData: false,
      useIsLoading: false,
      dataBatches: observable.shallow,
      batchLoadingStates: observable.shallow,
      mergedData: computed,
      isLoading: computed,
      reset: action.bound,
      setDataBatch: action.bound,
      setBatchLoadingState: action.bound,
    });
  }

  public static useNew<T>(): IncrementalLoaderState<T> {
    return useRef(new IncrementalLoaderState<T>()).current;
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

  public get mergedData(): T[] {
    const dataBatches =
      this.dataBatches.length === 0 ? this.prevDataBatches : this.dataBatches;

    return dataBatches.flatMap((d) => d);
  }

  public useMergedData(): T[] {
    return useSelector(() => this.mergedData);
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
