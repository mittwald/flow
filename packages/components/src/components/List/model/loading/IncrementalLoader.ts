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
    this.list.pagination.updateItemTotalCount(0);
    this.list.reactTable.table.setPagination(() => ({
      pageIndex: 0,
      pageSize: this.list.pagination.initialPageSize,
    }));
  }

  public useIsLoading(): boolean {
    return this.loaderState.useIsLoading();
  }

  public useData(): T[] {
    return this.loaderState.useMergedData();
  }

  public getLoaderInvocationHooks(): Array<() => void> {
    const pages = times(this.list.pagination.getPageIndex() + 1, (i) => i);
    return pages.map((i) => () => {
      this.useLoadPage(i);
    });
  }

  private useLoadPage(pageIndex: number): void {
    const asyncResource = this.getPageDataAsyncResource(pageIndex);

    const asyncData = asyncResource.use({
      useSuspense: false,
    });

    useEffect(() => {
      if (!asyncData.hasValue) {
        return;
      }

      const { data, itemTotalCount } = asyncData.value;
      this.loaderState.setDataBatch(pageIndex, data);

      if (itemTotalCount !== undefined) {
        this.list.pagination.updateItemTotalCount(itemTotalCount);
      }
    }, [pageIndex, asyncData.maybeValue]);

    useEffect(() => {
      this.loaderState.setBatchLoadingState(
        pageIndex,
        asyncResource.state.value,
      );

      return asyncResource.state.observe((newState) => {
        this.loaderState.setBatchLoadingState(pageIndex, newState);
      });
    }, [asyncResource, pageIndex]);
  }

  private getDataLoaderOptions(pageIndex: number): DataLoaderOptions<T> {
    return {
      pagination: this.manualPagination
        ? {
            limit: this.list.pagination.initialPageSize,
            offset: this.list.pagination.initialPageSize * pageIndex,
          }
        : undefined,

      sorting: this.manualSorting
        ? (Object.fromEntries(
            this.list.sorting
              .filter((s) => s.direction !== false)
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

  private getPageDataAsyncResource(
    pageIndex: number,
  ): AsyncResource<DataLoaderResult<T>> {
    const dataSource = this.dataSource;
    const loaderOptions = this.getDataLoaderOptions(pageIndex);

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

  public loadMore(): void {
    if (this.manualPagination) {
      this.list.pagination.nextPage();
    } else {
      this.list.pagination.updatePageSize(
        this.list.pagination.getPageSize() +
          this.list.pagination.initialPageSize,
      );
    }
  }
}
