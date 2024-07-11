import type { PropsWithChildren } from "react";
import React from "react";
import { listContext } from "./listContext";
import { DataLoader } from "@/components/List/components/DataLoader";
import { Header } from "@/components/List/components/Header/Header";
import styles from "./List.module.css";
import ListModel from "@/components/List/model/List";
import { ItemList } from "@/components/List/components/Items/ItemList";
import { deepFilterByType, deepFindOfType } from "@/lib/react/deepFindOfType";
import { ListLoaderAsync } from "@/components/List/components/ListLoaderAsync";
import { ListFilter } from "@/components/List/components/Header/ListFilter";
import { ListSorting } from "@/components/List/components/Header/ListSorting";
import { ListItemView } from "@/components/List/components/Items/ListItemView";
import { ListStaticData } from "@/components/List/components/ListStaticData";
import { ListLoaderAsyncResource } from "@/components/List/components/ListLoaderAsyncResource";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import Footer from "./components/Footer/Footer";
import { FallbackRenderer } from "@/components/List/components/Items/ListItem/FallbackRenderer";
import type { RenderItemFn } from "@/components/List/model/item/types";

interface Props extends PropsWithChildren {
  batchSize?: number;
}

export function List(props: Props) {
  const { children, batchSize, ...restShape } = props;

  const listLoaderAsync = deepFindOfType(
    children,
    ListLoaderAsync<never>,
  )?.props;
  const listLoaderAsyncResource = deepFindOfType(
    children,
    ListLoaderAsyncResource<never>,
  )?.props;
  const listStaticData = deepFindOfType(children, ListStaticData<never>)?.props;

  const loaderShape: IncrementalLoaderShape<never> = {
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

  const fallbackRenderItemFn: RenderItemFn<never> = (data) => (
    <FallbackRenderer data={data} />
  );

  const listModel = ListModel.useNew<never>({
    loader: loaderShape,
    filters: deepFilterByType(children, ListFilter<never, never, never>).map(
      (f) => f.props,
    ),
    sorting: deepFilterByType(children, ListSorting<never>).map((s) => s.props),
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
        <Header />
        <ItemList />
        <Footer />
      </div>
    </listContext.Provider>
  );
}

export default List;
