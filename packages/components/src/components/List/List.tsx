import type { PropsWithChildren } from "react";
import React from "react";
import { listContext } from "./listContext";
import { DataLoader } from "@/components/List/components/DataLoader";
import { PaginationInfos } from "@/components/List/components/PaginationInfos";
import { FilterBar } from "@/components/List/components/FilterBar";
import styles from "./List.module.css";
import ListModel from "@/components/List/model/List";
import { ShowNextBatchButton } from "src/components/List/components/ShowNextBatchButton";
import { Items } from "@/components/List/components/Items";
import { deepFilterByType, deepFindOfType } from "@/lib/react/deepFindOfType";
import type { RenderItemFn } from "@/components/List/model/item/Item";
import { ListLoaderAsync } from "@/components/List/components/ListLoaderAsync";
import { ListFilter } from "@/components/List/components/ListFilter";
import { ListSorting } from "@/components/List/components/ListSorting";
import { ListItemView } from "@/components/List/components/ListItemView";
import type { AnyData } from "@/components/List/model/item/types";
import type { ListShape } from "@/components/List/model/types";
import { ListStaticData } from "@/components/List/components/ListStaticData";
import { FallbackRenderer } from "@/components/List/components/Item/FallbackRenderer";
import { ListLoaderAsyncResource } from "@/components/List/components/ListLoaderAsyncResource";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";

interface Props
  extends PropsWithChildren,
    Pick<ListShape<AnyData>, "enableMultiSort"> {
  batchSize?: number;
}

export function List(props: Props) {
  const { children, batchSize, ...restShape } = props;

  const listLoaderAsync = deepFindOfType(children, ListLoaderAsync)?.props;
  const listLoaderAsyncResource = deepFindOfType(
    children,
    ListLoaderAsyncResource,
  )?.props;
  const listStaticData = deepFindOfType(children, ListStaticData)?.props;

  const loaderShape: IncrementalLoaderShape<AnyData> = {
    source: listLoaderAsync
      ? {
          ...listLoaderAsync,
          asyncLoader: listLoaderAsync.children,
        }
      : listLoaderAsyncResource
        ? {
            ...listLoaderAsyncResource,
            asyncResourceFactory: listLoaderAsyncResource.children,
          }
        : listStaticData
          ? {
              staticData: listStaticData.data,
            }
          : undefined,
  };

  const fallbackRenderItemFn: RenderItemFn<AnyData> = (data) => (
    <FallbackRenderer data={data} />
  );

  const listModel = ListModel.useNew({
    loader: loaderShape,
    filters: deepFilterByType(children, ListFilter).map((f) => f.props),
    sorting: deepFilterByType(children, ListSorting).map((s) => s.props),
    render:
      deepFindOfType(children, ListItemView)?.props.children ??
      fallbackRenderItemFn,
    ...restShape,
    batchesController: {
      batchSize,
    },
  });

  return (
    <listContext.Provider
      value={{
        list: listModel,
      }}
    >
      <DataLoader />
      <div className={styles.list}>
        <FilterBar className={styles.filterBar} />
        <Items className={styles.rows} />
        <PaginationInfos className={styles.paginationInfos} />
        <ShowNextBatchButton className={styles.showMoreButton} />
      </div>
    </listContext.Provider>
  );
}

export default List;
