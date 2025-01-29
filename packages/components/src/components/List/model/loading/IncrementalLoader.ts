import type List from "@/components/List/model/List";
import type {
  DataLoaderOptions,
  DataLoaderResult,
  DataSource,
  IncrementalLoaderShape,
} from "@/components/List/model/loading/types";
import type { AsyncResource } from "@mittwald/react-use-promise";
import { getAsyncResource } from "@mittwald/react-use-promise";
import { useEffect } from "react";
import { times } from "remeda";
import { IncrementalLoaderState } from "@/components/List/model/loading/IncrementalLoaderState";
import { hash } from "object-code";
import type { PropertyName } from "@/components/List/model/types";

type AsyncResourceLoadingState = AsyncResource["state"]["value"];

const emptyData: never[] = [];

export class IncrementalLoader<T> {
  private readonly list: List<T>;
  private readonly dataSource: DataSource<T>;
  public readonly manualSorting: boolean;
  public readonly manualFiltering: boolean;
  public readonly manualPagination: boolean;
  public readonly loaderState: IncrementalLoaderState<T>;
  public readonly staticDataProperties: PropertyName<T>[] = [];

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
    this.list.search?.onUpdated(() => this.reset());

    this.initStaticDataProperties();
  }

  public static useNew<T>(
    list: List<T>,
    shape: IncrementalLoaderShape<T> = {},
  ): IncrementalLoader<T> {
    return new IncrementalLoader(list, shape);
  }

  private initStaticDataProperties() {
    const addPropertiesOfDataEntry = (data: unknown) => {
      if (typeof data !== "object" || data === null) {
        return;
      }

      (Object.keys(data) as PropertyName<T>[])
        .filter((p) => !this.staticDataProperties.includes(p))
        .forEach((p) => {
          this.staticDataProperties.push(p);
        });
    };

    if ("staticData" in this.dataSource) {
      this.dataSource.staticData
        // collect properties from just the first 100 items
        .slice(0, 100)
        .forEach(addPropertiesOfDataEntry);
    }
  }

  private reset(): void {
    this.loaderState.reset();
  }

  public useIsLoading(): boolean {
    return this.loaderState.useIsLoading();
  }

  public useIsInitiallyLoading(): boolean {
    return this.useIsLoading() && this.list.batches.getBatchIndex() === 0;
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

    asyncResource.use({
      useSuspense: false,
    });

    this.useObserveBatchData(asyncResource, batchIndex);
    this.useObserveBatchLoadingState(asyncResource, batchIndex);
  }

  private useObserveBatchLoadingState(
    asyncResource: AsyncResource<DataLoaderResult<T>>,
    batchIndex: number,
  ): void {
    const setNewState = (newState: AsyncResourceLoadingState) => {
      this.loaderState.setBatchLoadingState(
        batchIndex,
        this.loaderState.isBatchLoaded(batchIndex) ? "loaded" : newState,
      );
    };

    useEffect(() => {
      setNewState(asyncResource.state.value);
      return asyncResource.state.observe(setNewState);
    }, [asyncResource, batchIndex]);
  }

  private useObserveBatchData(
    asyncResource: AsyncResource<DataLoaderResult<T>>,
    batchIndex: number,
  ): void {
    const setData = (loaderResult: DataLoaderResult<T>): void => {
      const { data, itemTotalCount } = loaderResult;
      this.loaderState.setDataBatch(batchIndex, data);

      if (itemTotalCount !== undefined) {
        this.list.batches.updateItemTotalCount(itemTotalCount);
      }
    };

    useEffect(() => {
      if (asyncResource.value.value.isSet) {
        setData(asyncResource.value.value.value);
      }

      return asyncResource.value.observe((asyncData) => {
        if (asyncData.isSet) {
          setData(asyncData.value);
        }
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
                {
                  mode: f.mode,
                  values: f.getArrayValue().map((v) => v.value),
                },
              ]),
          ) as DataLoaderOptions<T>["filtering"])
        : undefined,

      searchString: this.manualFiltering
        ? this.list.reactTable.searchString
        : undefined,
    };
  }

  private getBatchDataAsyncResource(
    batchIndex: number,
  ): AsyncResource<DataLoaderResult<T>> {
    const dataSource = this.dataSource;
    const loaderOptions = this.getDataLoaderOptions(batchIndex);

    if ("staticData" in dataSource) {
      return getAsyncResource(
        async (staticData) => ({
          data: staticData as T[],
          itemTotalCount: staticData.length,
        }),
        [dataSource.staticData],
      );
    }

    if ("asyncLoader" in dataSource) {
      const asyncLoader = dataSource.asyncLoader;
      const dependencies = dataSource.dependencies;
      const loaderId = dependencies ? hash(dependencies).toString() : undefined;
      return getAsyncResource(asyncLoader, [loaderOptions], {
        loaderId,
      });
    }

    if ("asyncResourceFactory" in dataSource) {
      const asyncResourceFactory = dataSource.asyncResourceFactory;
      return asyncResourceFactory(loaderOptions);
    }

    throw new Error("Unknown data source");
  }
}
