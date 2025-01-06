import type Header from "@/components/List/viewComponents/Header/Header";
import type { FC, PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";
import type { FilterPicker } from "@/components/List/viewComponents/Header/FilterPicker/FilterPicker";
import type { FilterPickerMenuItem } from "@/components/List/viewComponents/Header/FilterPicker/FilterPickerMenuItem";
import type {
  ActiveFilterItem,
  ActiveFilterList,
} from "@/components/List/viewComponents/Header";
import type Fragment from "@/components/Fragment";
import type Items from "@/components/List/viewComponents/Items/Items";
import type Item from "@/components/List/viewComponents/Items/Item";
import type ListView from "@/components/List/viewComponents/List/List";
import type PaginationInfos from "@/components/List/viewComponents/Footer/PaginationInfos";
import type LoadNextBatchButton from "@/components/List/viewComponents/Footer/LoadNextBatchButton";
import type { Footer } from "@/components/List/viewComponents/Footer";

interface Context {
  fragment?: typeof Fragment;
  header?: typeof Header;
  filterPicker?: typeof FilterPicker;
  filterPickerMenuItem?: typeof FilterPickerMenuItem;
  activeFilterList?: typeof ActiveFilterList;
  activeFilterItem?: typeof ActiveFilterItem;
  items?: typeof Items;
  item?: typeof Item;
  list?: typeof ListView;
  footer?: typeof Footer;
  paginationInfos?: typeof PaginationInfos;
  loadNextBatchButton?: typeof LoadNextBatchButton;
}

const context = createContext<Context>({});

export const useListViewComponents = () => useContext(context);

interface Props extends PropsWithChildren {
  components: Partial<Context>;
}

export const ListViewComponentsProvider: FC<Props> = (props) => {
  const { components, children } = props;
  return <context.Provider value={components}>{children}</context.Provider>;
};
