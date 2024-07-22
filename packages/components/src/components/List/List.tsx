import type { PropsWithChildren } from "react";
import React from "react";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { listContext } from "./listContext";
import { DataLoader } from "@/components/List/components/DataLoader";
import { Header } from "@/components/List/components/Header";
import styles from "./List.module.css";
import ListModel from "@/components/List/model/List";
import { Items } from "@/components/List/components/Items";
import { deepFilterByType, deepFindOfType } from "@/lib/react/deepFindOfType";
import { ListLoaderAsync } from "@/components/List/setupComponents/ListLoaderAsync";
import { ListFilter } from "@/components/List/setupComponents/ListFilter";
import { ListSorting } from "@/components/List/setupComponents/ListSorting";
import { ListItem } from "@/components/List/setupComponents/ListItem";
import { ListStaticData } from "@/components/List/setupComponents/ListStaticData";
import { ListLoaderAsyncResource } from "@/components/List/setupComponents/ListLoaderAsyncResource";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import Footer from "./components/Footer";
import { ListSearch } from "@/components/List/setupComponents/ListSearch";
import type { ItemListProps } from "@/components/List/components/Items/Items";

export interface ListProps
  extends PropsWithChildren,
    ItemListProps,
    FlowComponentProps {
  batchSize?: number;
}

export const List = flowComponent("List", (props) => {
  const { children, batchSize, ...itemListProps } = props;

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

  const searchProps = deepFindOfType(children, ListSearch)?.props;
  const itemViewProps = deepFindOfType(children, ListItem)?.props;

  const listModel = ListModel.useNew<never>({
    loader: loaderShape,
    filters: deepFilterByType(children, ListFilter<never, never, never>).map(
      (f) => f.props,
    ),
    search: searchProps
      ? {
          render: searchProps.children,
          textFieldProps: searchProps,
        }
      : undefined,
    sorting: deepFilterByType(children, ListSorting<never>).map((s) => s.props),

    itemView: itemViewProps
      ? {
          ...itemViewProps,
          renderFn: itemViewProps.children,
        }
      : undefined,

    batchesController: {
      batchSize,
    },
    hasAction: !!props.onAction,
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
        <Items {...itemListProps} />
        <Footer />
      </div>
    </listContext.Provider>
  );
});

export default List;
