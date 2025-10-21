import type List from "@/components/List/model/List";
import type {
  DataLoaderOptions,
  DataLoaderResult,
  DataSource,
  IncrementalLoaderShape,
  LoaderInvocationHook,
} from "@/components/List/model/loading/types";
import type { AsyncResource } from "@mittwald/react-use-promise";
import { getAsyncResource, usePromise } from "@mittwald/react-use-promise";
import { useEffect } from "react";
import { times } from "remeda";
import { IncrementalLoaderState } from "@/components/List/model/loading/IncrementalLoaderState";
import { hash } from "object-code";
import type { PropertyName } from "@/components/List/model/types";
import { useMemo } from "react";

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

  private getUseData(): (options: DataLoaderOptions<T>) => DataLoaderResult<T> {
    const dataSource = this.dataSource;

    return (options: DataLoaderOptions<T>) => {
      if ("useData" in dataSource) {
        return dataSource.useData(options);
      }

      if ("asyncLoader" in dataSource) {
        const asyncLoader = dataSource.asyncLoader;
        const dependencies = dataSource.dependencies;
        const loaderId = dependencies
          ? hash(dependencies).toString()
          : undefined;

        return usePromise(asyncLoader, [options], {
          loaderId,
        });
      }

      if ("asyncResourceFactory" in dataSource) {
        return dataSource.asyncResourceFactory(options).use();
      }

      return useMemo(
        () => ({
          data: [],
          itemTotalCount: 0,
        }),
        [],
      );
    };
  }

  public getLoaderInvocationHooks(): LoaderInvocationHook[] {
    const batchesCount = times(this.list.batches.getBatchIndex() + 1, (i) => i);
    const useData = this.getUseData();

    return batchesCount.map((batchIndex) => ({
      useLoadBatch: () => {
        const loaderOptions = this.getDataLoaderOptions(batchIndex);
        const loaderResult = useData(loaderOptions);
        const { data, itemTotalCount } = loaderResult;

        useEffect(() => {
          this.loaderState.setDataBatch(batchIndex, data);

          if (itemTotalCount !== undefined) {
            this.list.batches.updateItemTotalCount(itemTotalCount);
          }

          this.loaderState.setBatchLoadingState(batchIndex, "loaded");
        }, [loaderResult]);
      },

      useRenderSuspense: () => {
        useEffect(() => {
          this.loaderState.setBatchLoadingState(batchIndex, "loading");
        }, [batchIndex]);
      },
    }));
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
