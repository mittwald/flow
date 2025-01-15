import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import { FilterPicker } from "~/components/List/components/Header/components/FilterPicker/FilterPicker";
import { ActiveFilterList } from "~/components/List/components/Header/components/ActiveFilterList";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import { ViewModeMenu } from "~/components/List/components/Header/components/ViewModeMenu/ViewModeMenu";
import * as ListViews from "~/components/List/views";
import Fragment from "~/components/Fragment";

interface Props {
  hasActionGroup?: boolean;
}

export const Header: FC<Props> = (props) => {
  const { hasActionGroup } = props;
  const list = useList();

  const Views = {
    Header: useViewComponent("ListHeaderView", ListViews.Header),
    Fragment: useViewComponent("Fragment", Fragment),
  };

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
    <Views.Header
      onSearchChanged={(search) => {
        list.search?.setValue(search);
      }}
      autoSubmitSearch={list.search?.autoSubmit}
      searchValue={list.search?.value}
      showSearch={!!list.search}
      filterPickerList={<Views.Fragment>{filterPickerList}</Views.Fragment>}
      viewModeMenu={
        <Views.Fragment>
          <ViewModeMenu />
        </Views.Fragment>
      }
      activeFilterList={
        <Views.Fragment>
          <ActiveFilterList />
        </Views.Fragment>
      }
    />
  );
};

export default Header;
