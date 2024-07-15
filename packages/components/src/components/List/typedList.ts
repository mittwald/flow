import List from "@/components/List/List";
import { TypedListFilter } from "@/components/List/setupComponents/ListFilter";
import { TypedListSorting } from "@/components/List/setupComponents/ListSorting";
import { TypedListItem } from "@/components/List/setupComponents/ListItem";
import { TypedListLoaderAsync } from "@/components/List/setupComponents/ListLoaderAsync";
import { TypedListLoaderAsyncResource } from "@/components/List/setupComponents/ListLoaderAsyncResource";
import { TypedListStaticData } from "@/components/List/setupComponents/ListStaticData";
import { TypedListSearch } from "@/components/List/setupComponents/ListSearch";
import { View } from "@/components/List/components/Items/components/Item/components/View";

export const typedList = <T>() => ({
  List: List,
  Filter: TypedListFilter<T>(),
  Search: TypedListSearch<T>(),
  Sorting: TypedListSorting<T>(),
  Item: TypedListItem<T>(),
  ItemView: View,
  StaticData: TypedListStaticData<T>(),
  LoaderAsync: TypedListLoaderAsync<T>(),
  LoaderAsyncResource: TypedListLoaderAsyncResource<T>(),
});
