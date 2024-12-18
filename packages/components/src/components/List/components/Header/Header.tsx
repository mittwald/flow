import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import { useListViewComponents } from "@/components/List/viewComponents/ListViewComponentsProvider";
import { FilterPicker } from "@/components/List/components/Header/components/FilterPicker/FilterPicker";
import HeaderView from "@/components/List/viewComponents/Header/Header";
import Fragment from "@/components/Fragment";
import { ActiveFilterList } from "@/components/List/components/Header/components/ActiveFilterList";

interface Props {
  hasActionGroup?: boolean;
}

export const Header: FC<Props> = (props) => {
  const { hasActionGroup } = props;
  const list = useList();
  const { header: View = HeaderView, fragment: FragmentView = Fragment } =
    useListViewComponents();

  if (
    list.filters.length === 0 &&
    list.visibleSorting.length === 0 &&
    !list.search &&
    !list.table &&
    !hasActionGroup
  ) {
    return null;
  }

  const filterPickerList = list.filters.map((filter) => (
    <FilterPicker key={filter.property} filter={filter} />
  ));

  return (
    <View
      onSearchChanged={(search) => {
        list.search?.setValue(search);
      }}
      autoSubmitSearch={list.search?.autoSubmit}
      searchValue={list.search?.value}
      showSearch={!!list.search}
      filterPickerList={<FragmentView>{filterPickerList}</FragmentView>}
      activeFilterList={
        <FragmentView>
          <ActiveFilterList />
        </FragmentView>
      }
    />
  );
};

export default Header;
