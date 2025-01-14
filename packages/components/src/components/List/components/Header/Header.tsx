import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import { FilterPicker } from "~/components/List/components/Header/components/FilterPicker/FilterPicker";
import DefaultView from "~/components/List/views/Header/Header";
import DefaultFragmentView from "~/components/Fragment";
import { ActiveFilterList } from "~/components/List/components/Header/components/ActiveFilterList";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponents";

interface Props {
  hasActionGroup?: boolean;
}

export const Header: FC<Props> = (props) => {
  const { hasActionGroup } = props;
  const list = useList();

  const {
    Header: View = DefaultView,
    Fragment: FragmentView = DefaultFragmentView,
  } = useViewComponents("List");

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
