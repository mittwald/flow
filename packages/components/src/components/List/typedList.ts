import type { ListProps } from "@/components/List/List";
import List from "@/components/List/List";
import { TypedListFilter } from "@/components/List/setupComponents/ListFilter";
import { TypedListSorting } from "@/components/List/setupComponents/ListSorting";
import { TypedListItem } from "@/components/List/setupComponents/ListItem";
import { TypedListLoaderAsync } from "@/components/List/setupComponents/ListLoaderAsync";
import { TypedListLoaderAsyncResource } from "@/components/List/setupComponents/ListLoaderAsyncResource";
import { TypedListStaticData } from "@/components/List/setupComponents/ListStaticData";
import { TypedListSearch } from "@/components/List/setupComponents/ListSearch";
import { ListItemView } from "@/components/List/components/ListItemView/ListItemView";
import type { ComponentType } from "react";
import { TableColumn } from "@/components/List/setupComponents/TableColumn";
import { TableCell } from "@/components/List/setupComponents/TableCell";
import { TableHeader } from "@/components/List/setupComponents/TableHeader";
import { TableRow } from "@/components/List/setupComponents/TableRow";
import { TableBody } from "@/components/List/setupComponents/TableBody";
import { Table } from "@/components/List/setupComponents/Table";
import { TypedListLoaderHooks } from "@/components/List/setupComponents/ListLoaderHooks";

export const TypedList = <T>() =>
  List as unknown as ComponentType<ListProps<T>>;

export const typedList = <T>() => ({
  List: TypedList<T>(),
  Filter: TypedListFilter<T>(),
  Search: TypedListSearch<T>(),
  Sorting: TypedListSorting<T>(),
  Item: TypedListItem<T>(),
  ItemView: ListItemView,
  TableHeader: TableHeader<T>,
  TableColumn: TableColumn<T>,
  TableBody: TableBody<T>,
  TableRow: TableRow<T>,
  TableCell: TableCell<T>,
  Table: Table<T>,
  StaticData: TypedListStaticData<T>(),
  LoaderAsync: TypedListLoaderAsync<T>(),
  LoaderHooks: TypedListLoaderHooks<T>(),
  LoaderAsyncResource: TypedListLoaderAsyncResource<T>(),
});
