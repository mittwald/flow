import List from "@/components/List/List";
import { TypedListFilter } from "@/components/List/components/Header/ListFilter";
import { TypedListSorting } from "@/components/List/components/Header/ListSorting";
import { TypedListItemView } from "@/components/List/components/Items/ListItemView";
import { TypedListLoaderAsync } from "@/components/List/components/ListLoaderAsync";
import { TypedListLoaderAsyncResource } from "@/components/List/components/ListLoaderAsyncResource";
import { TypedListStaticData } from "@/components/List/components/ListStaticData";

export const typedList = <T>() => ({
  List: List,
  Filter: TypedListFilter<T>(),
  Sorting: TypedListSorting<T>(),
  ItemView: TypedListItemView<T>(),
  StaticData: TypedListStaticData<T>(),
  LoaderAsync: TypedListLoaderAsync<T>(),
  LoaderAsyncResource: TypedListLoaderAsyncResource<T>(),
});
