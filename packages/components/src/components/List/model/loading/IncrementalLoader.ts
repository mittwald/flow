import List from "@/components/List/model/List";
import {
  DataLoaderOptions,
  DataLoaderResult,
  DataSource,
  IncrementalLoaderShape,
} from "@/components/List/model/loading/types";
import { AnyData } from "@/components/List/model/item/types";
import { AsyncResource, getAsyncResource } from "@mittwald/react-use-promise";
import { Signal, useSignal } from "@preact/signals-react";
import { useMemo } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { times } from "remeda";

const emptyData: AnyData[] = [];

type AsyncResourceLoadingState = AsyncResource["state"]["value"];
type PagesData = Record<number, AnyData[]>;
type PagesLoadingState = Record<number, AsyncResourceLoadingState>;

export class IncrementalLoader<T> {
  private readonly list: List<T>;
  private readonly dataSource: DataSource<T>;
  private readonly pagesDataSignal: Signal<PagesData>;
  private readonly pagesLoadingStateSignal: Signal<PagesLoadingState>;
  public readonly manualSorting: boolean;
  public readonly manualFiltering: boolean;
  public readonly manualPagination: boolean;

  public constructor(list: List<T>, shape: IncrementalLoaderShape<T> = {}) {
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
    this.pagesDataSignal = useSignal<PagesData>({});
    this.pagesLoadingStateSignal = useSignal<PagesLoadingState>({});

    this.manualPagination = manualPagination ?? false;
    this.manualFiltering = manualFiltering ?? this.manualPagination;
    this.manualSorting = manualSorting ?? this.manualPagination;

    this.list.filters.forEach((f) => f.onFilterUpdated(() => this.reset()));
  }

  private reset(): void {
    this.pagesLoadingStateSignal.value = {};
    this.pagesDataSignal.value = {};
    this.list.reactTable.table.setPagination(() => ({
      pageIndex: 0,
      pageSize: this.list.pagination.initialPageSize,
    }));
  }

  public useIsLoading(): boolean {
    useSignals();
    return Object.values(this.pagesLoadingStateSignal.value).some(
      (s) => s === "loading",
    );
  }

  public useData(): T[] {
    useSignals();
    const pagesData = Object.values(this.pagesDataSignal.value);
    return useMemo(
      () => pagesData.flatMap((d) => d),
      [this.pagesDataSignal.value],
    );
  }

  public getLoaderInvocationHooks(): Array<() => void> {
    const pages = times(this.list.pagination.getPageIndex() + 1, (i) => i);
    return pages.map((i) => () => {
      this.useLoadPage(i);
    });
  }

  private useLoadPage(pageIndex: number): void {
    const asyncResource = this.getPageDataAsyncResource(pageIndex);
    this.updatePageLoadingState(pageIndex, asyncResource.state.value);

    const { data, itemTotalCount } = asyncResource.use();
    this.updatePageData(pageIndex, data);
    this.updatePageLoadingState(pageIndex, asyncResource.state.value);

    if (itemTotalCount !== undefined) {
      this.list.pagination.updateItemTotalCount(itemTotalCount);
    }
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

  private updatePageData(pageIndex: number, data: T[]): void {
    if (this.pagesDataSignal.value[pageIndex] !== data) {
      this.pagesDataSignal.value = {
        ...this.pagesDataSignal.value,
        [pageIndex]: data,
      };
    }
  }

  private updatePageLoadingState(
    pageIndex: number,
    loadingState: AsyncResourceLoadingState,
  ): void {
    if (this.pagesLoadingStateSignal.value[pageIndex] !== loadingState) {
      this.pagesLoadingStateSignal.value = {
        ...this.pagesLoadingStateSignal.value,
        [pageIndex]: loadingState,
      };
    }
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
