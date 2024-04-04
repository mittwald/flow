import React, { PropsWithChildren } from "react";
import { listContext } from "./listContext";
import { DataLoader } from "@/components/List/components/DataLoader";
import { PaginationInfos } from "src/components/List/components/Pagination/PaginationInfos";
import { FilterPickerList } from "@/components/List/components/Filters/FilterPickerList";
import styles from "./List.module.css";
import ListModel from "@/components/List/model/List";
import { ShowMoreItemsButton } from "src/components/List/components/Pagination/ShowMoreItemsButton";
import { ItemList } from "@/components/List/components/Items/ItemList";
import { deepFilterByType, deepFindOfType } from "@/lib/react/deepFindOfType";
import { RenderItemFn } from "@/components/List/model/item/Item";
import { ListLoaderAsync } from "@/components/List/components/ListLoaderAsync";
import { ListFilter } from "@/components/List/components/Filters/ListFilter";
import { ListSorting } from "@/components/List/components/Filters/ListSorting";
import { ListItemView } from "@/components/List/components/Items/ListItemView";
import { AnyData } from "@/components/List/model/item/types";
import { ListShape } from "@/components/List/model/types";
import { ListStaticData } from "@/components/List/components/ListStaticData";
import { FallbackRenderer } from "@/components/List/components/Items/Item";
import { ListLoaderAsyncResource } from "@/components/List/components/ListLoaderAsyncResource";
import { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import Pagination from "./components/Pagination/Pagination";

interface Props
  extends PropsWithChildren,
    Pick<ListShape<AnyData>, "enableMultiSort"> {}

export function List(props: Props) {
  const { children, ...restShape } = props;

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
  });

  return (
    <listContext.Provider
      value={{
        list: listModel,
      }}
    >
      <DataLoader />
      <div className={styles.list}>
        <FilterPickerList />
        <ItemList />
        <Pagination />
      </div>
    </listContext.Provider>
  );
}

export default List;
