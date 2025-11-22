import { DataLoader } from "@/components/List/components/DataLoader";
import { Header } from "@/components/List/components/Header/Header";
import headerStyles from "@/components/List/components/Header/Header.module.css";
import { Items } from "@/components/List/components/Items/Items";
import { Table } from "@/components/List/components/Table";
import ListModel from "@/components/List/model/List";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import type { ListShape } from "@/components/List/model/types";
import { ListFilter } from "@/components/List/setupComponents/ListFilter";
import { ListItem } from "@/components/List/setupComponents/ListItem";
import { ListLoaderAsync } from "@/components/List/setupComponents/ListLoaderAsync";
import { ListLoaderAsyncResource } from "@/components/List/setupComponents/ListLoaderAsyncResource";
import { ListSearch } from "@/components/List/setupComponents/ListSearch";
import { ListSorting } from "@/components/List/setupComponents/ListSorting";
import { ListStaticData } from "@/components/List/setupComponents/ListStaticData";
import { Table as TableSetupComponent } from "@/components/List/setupComponents/Table";
import { TableBody } from "@/components/List/setupComponents/TableBody";
import { TableCell } from "@/components/List/setupComponents/TableCell";
import { TableColumn } from "@/components/List/setupComponents/TableColumn";
import { TableHeader } from "@/components/List/setupComponents/TableHeader";
import { TableRow } from "@/components/List/setupComponents/TableRow";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { deepFilterByType, deepFindOfType } from "@/lib/react/deepFindOfType";
import DivView from "@/views/DivView";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { PropsWithChildren } from "react";
import Footer from "./components/Footer";
import styles from "./List.module.css";
import { listContext } from "./listContext";
import { ListLoaderHooks } from "@/components/List/setupComponents/ListLoaderHooks";

export interface ListProps<T, TMeta = unknown>
  extends PropsWithChildren,
    FlowComponentProps,
    Omit<
      ListShape<T, TMeta>,
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
  hidePagination?: boolean;
}

export const List = flowComponent("List", (props) => {
  const { children, batchSize, onChange, ref, hidePagination, ...restProps } =
    props;

  const listLoaderAsync = deepFindOfType(
    children,
    ListLoaderAsync<never>,
  )?.props;
  const listLoaderHooks = deepFindOfType(
    children,
    ListLoaderHooks<never>,
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
          : listLoaderHooks
            ? {
                ...listLoaderHooks,
                useData: listLoaderHooks.children,
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
          render: searchProps.children,
          textFieldProps: searchProps,
          defaultValue: searchProps.defaultValue,
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
      tunnelId: "actions",
      className: headerStyles.actions,
      Button: {
        className: headerStyles.action,
      },
    },
    ListSummary: {
      tunnelId: "listSummary",
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider>
        <listContext.Provider
          value={{
            list: listModel,
          }}
        >
          <DataLoader />
          <DivView className={styles.list} ref={ref}>
            {children}
            <Header />

            <DivView className={styles.listWrapper}>
              {listModel.items.entries.length > 0 && (
                <TunnelExit id="listSummary" />
              )}
              {(listModel.viewMode === "list" ||
                listModel.viewMode === "tiles") && <Items />}
              {listModel.viewMode === "table" && <Table />}
            </DivView>
            {!hidePagination && <Footer />}
          </DivView>
        </listContext.Provider>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default List;
