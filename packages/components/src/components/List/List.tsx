import type { PropsWithChildren } from "react";
import React from "react";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { listContext } from "./listContext";
import { Header } from "@/components/List/components/Header";
import ListModel from "@/components/List/model/List";
import { deepFilterByType, deepFindOfType } from "@/lib/react/deepFindOfType";
import { ListLoaderAsync } from "@/components/List/setupComponents/ListLoaderAsync";
import { ListFilter } from "@/components/List/setupComponents/ListFilter";
import { ListSorting } from "@/components/List/setupComponents/ListSorting";
import { ListItem } from "@/components/List/setupComponents/ListItem";
import { ListStaticData } from "@/components/List/setupComponents/ListStaticData";
import { ListLoaderAsyncResource } from "@/components/List/setupComponents/ListLoaderAsyncResource";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import { ListSearch } from "@/components/List/setupComponents/ListSearch";
import type { ListShape } from "@/components/List/model/types";
import { TableColumn } from "@/components/List/setupComponents/TableColumn";
import { TableRow } from "@/components/List/setupComponents/TableRow";
import { TableCell } from "@/components/List/setupComponents/TableCell";
import { Table as TableSetupComponent } from "@/components/List/setupComponents/Table";
import { TableHeader } from "@/components/List/setupComponents/TableHeader";
import { TableBody } from "@/components/List/setupComponents/TableBody";
import { TunnelProvider } from "@mittwald/react-tunnel";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import headerStyles from "./viewComponents/Header/Header.module.css";
import { ActionGroup } from "@/components/ActionGroup";
import { deepHas } from "@/lib/react/deepHas";
import DataLoader from "./components/DataLoader";
import { Items } from "@/components/List/components/Items";
import { useListViewComponents } from "@/components/List/viewComponents/ListViewComponentsProvider";
import ListView from "@/components/List/viewComponents/List/List";

export interface ListProps<T>
  extends PropsWithChildren,
    Omit<
      ListShape<T>,
      | "search"
      | "loader"
      | "itemView"
      | "table"
      | "batchesController"
      | "filters"
      | "sorting"
    > {
  /** The number of items to be displayed on one page. */
  batchSize?: number;
}

export const List = flowComponent("List", (props) => {
  const { children, batchSize, onChange, ref, ...restProps } = props;

  const { list: View = ListView } = useListViewComponents();

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
  const itemViewProps = deepFindOfType(children, ListItem<never>)?.props;

  const tableProps = deepFindOfType(children, TableSetupComponent)?.props;
  const tableColumnProps = deepFilterByType(children, TableColumn<never>).map(
    (c) => ({
      ...c.props,
      name: c.props.children,
    }),
  );
  const tableCellProps = deepFilterByType(children, TableCell<never>).map(
    (c) => ({
      ...c.props,
      renderFn: c.props.children,
    }),
  );

  const tableRowProps = deepFindOfType(children, TableRow)?.props;
  const tableHeaderProps = deepFindOfType(children, TableHeader)?.props;
  const tableBodyProps = deepFindOfType(children, TableBody)?.props;

  const listModel = ListModel.useNew<never>({
    onChange,
    loader: loaderShape,
    filters: deepFilterByType(children, ListFilter<never, never, never>).map(
      (f) => ({
        ...f.props,
        renderItem: f.props.children,
      }),
    ),
    search: searchProps
      ? {
          textFieldProps: searchProps,
          defaultValue: searchProps.defaultValue,
          autoSubmit: searchProps.autoSubmit,
        }
      : undefined,
    sorting: deepFilterByType(children, ListSorting<never>).map((s) => s.props),

    itemView: itemViewProps
      ? {
          ...itemViewProps,
          renderFn: itemViewProps.children,
        }
      : undefined,

    table:
      tableColumnProps.length > 0
        ? {
            header: {
              ...tableHeaderProps,
              columns: tableColumnProps,
            },
            body: {
              ...tableBodyProps,
              row: {
                ...tableRowProps,
                cells: tableCellProps,
              },
            },
            ...tableProps,
          }
        : undefined,

    batchesController: {
      batchSize,
    },
    ...restProps,
  });

  const propsContext: PropsContext = {
    ActionGroup: {
      className: headerStyles.actions,
      tunnelId: "actions",
      ignoreBreakpoint: true,
    },
    ListSummary: {
      tunnelId: "listSummary",
    },
  };

  const hasActionGroup = deepHas(children, ActionGroup);

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider>
        <listContext.Provider
          value={{
            list: listModel,
          }}
        >
          <View ref={ref}>
            <DataLoader />
            {children}
            <Header hasActionGroup={hasActionGroup} />
            <Items />
          </View>
        </listContext.Provider>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default List;
