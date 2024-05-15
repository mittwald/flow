import type List from "@/components/List/model/List";
import type {
  DataLoaderOptions,
  DataLoaderResult,
  DataSource,
  IncrementalLoaderShape,
} from "@/components/List/model/loading/types";
import type { AnyData } from "@/components/List/model/item/types";
import type { AsyncResource } from "@mittwald/react-use-promise";
import { getAsyncResource } from "@mittwald/react-use-promise";
import { useEffect } from "react";
import { times } from "remeda";
import { IncrementalLoaderState } from "@/components/List/model/loading/IncrementalLoaderState";

const emptyData: AnyData[] = [];

export class IncrementalLoader<T> {
  private readonly list: List<T>;
  private readonly dataSource: DataSource<T>;
  public readonly manualSorting: boolean;
  public readonly manualFiltering: boolean;
  public readonly manualPagination: boolean;
  public readonly loaderState: IncrementalLoaderState<T>;

  private constructor(list: List<T>, shape: IncrementalLoaderShape<T> = {}) {
    const { source } = shape;

    this.dataSource = source ?? { staticData: emptyData };

    const manualPagination =
      "manualPagination" in this.dataSource
        ? this.dataSource.manualPagination
        : undefined;

    const manualFiltering =
      "manualFiltering" in this.dataSource
        ? this.dataSource.manualFiltering
        : undefined;

    const manualSorting =
      "manualSorting" in this.dataSource
        ? this.dataSource.manualSorting
        : undefined;

    this.list = list;
    this.loaderState = IncrementalLoaderState.useNew<T>();

    this.manualPagination = manualPagination ?? false;
    this.manualFiltering = manualFiltering ?? this.manualPagination;
    this.manualSorting = manualSorting ?? this.manualPagination;
    this.list.filters.forEach((f) => f.onFilterUpdated(() => this.reset()));
  }

  public static useNew<T>(
    list: List<T>,
    shape: IncrementalLoaderShape<T> = {},
  ): IncrementalLoader<T> {
    return new IncrementalLoader(list, shape);
  }

  private reset(): void {
    this.loaderState.reset();
  }

  public useIsLoading(): boolean {
    return this.loaderState.useIsLoading();
  }

  public useData(): T[] {
    return this.loaderState.useMergedData();
  }

  public getLoaderInvocationHooks(): (() => void)[] {
    const batchesCount = times(this.list.batches.getBatchIndex() + 1, (i) => i);
    return batchesCount.map((i) => () => {
      this.useLoadBatch(i);
    });
  }

  private useLoadBatch(batchIndex: number): void {
    const asyncResource = this.getBatchDataAsyncResource(batchIndex);

    const asyncData = asyncResource.use({
      useSuspense: false,
    });

    useEffect(() => {
      if (!asyncData.hasValue) {
        return;
      }

      const { data, itemTotalCount } = asyncData.value;
      this.loaderState.setDataBatch(batchIndex, data);

      if (itemTotalCount !== undefined) {
        this.list.batches.updateItemTotalCount(itemTotalCount);
      }
    }, [batchIndex, asyncData.maybeValue]);

    useEffect(() => {
      this.loaderState.setBatchLoadingState(
        batchIndex,
        asyncResource.state.value,
      );

      return asyncResource.state.observe((newState) => {
        this.loaderState.setBatchLoadingState(batchIndex, newState);
      });
    }, [asyncResource, batchIndex]);
  }

  private getDataLoaderOptions(batchIndex: number): DataLoaderOptions<T> {
    return {
      pagination: this.manualPagination
        ? {
            limit: this.list.batches.batchSize,
            offset: this.list.batches.batchSize * batchIndex,
          }
        : undefined,

      sorting: this.manualSorting
        ? (Object.fromEntries(
            this.list.sorting
              .filter((s) => s.isSorted())
              .map((s) => [s.property, s.direction]),
          ) as DataLoaderOptions<T>["sorting"])
        : undefined,

      filtering: this.manualFiltering
        ? (Object.fromEntries(
            this.list.filters
              .filter((f) => f.getValue() !== null)
              .map((f) => [
                f.property,
                { mode: f.mode, values: f.getArrayValue() },
              ]),
          ) as DataLoaderOptions<T>["filtering"])
        : undefined,
    };
  }

  private getBatchDataAsyncResource(
    batchIndex: number,
  ): AsyncResource<DataLoaderResult<T>> {
    const dataSource = this.dataSource;
    const loaderOptions = this.getDataLoaderOptions(batchIndex);

    if ("staticData" in dataSource) {
      const staticData = dataSource.staticData;
      return getAsyncResource(
        async () => ({
          data: staticData,
          itemTotalCount: staticData.length,
        }),
        [],
      );
    }

    if ("asyncLoader" in dataSource) {
      const asyncLoader = dataSource.asyncLoader;
      return getAsyncResource(asyncLoader, [loaderOptions]);
    }

    if ("asyncResourceFactory" in dataSource) {
      const asyncResourceFactory = dataSource.asyncResourceFactory;
      return asyncResourceFactory(loaderOptions);
    }

    throw new Error("Unknown data source");
  }
}
