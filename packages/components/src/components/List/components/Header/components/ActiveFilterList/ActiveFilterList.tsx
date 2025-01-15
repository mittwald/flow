import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import { observer } from "mobx-react-lite";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import * as ListViews from "~/components/List/views";
import Fragment from "~/components/Fragment";

export const ActiveFilterList: FC = observer(() => {
  const list = useList();

  const Views = {
    ActiveFilterItem: useViewComponent(
      "ListActiveFilterItemView",
      ListViews.ActiveFilterItem,
    ),
    ActiveFilterList: useViewComponent("ListActiveFilterListView", Fragment),
  };

  const activeFilterValues = list.filters
    .flatMap((f) => f.values)
    .filter((v) => v.isActive);

  const someFiltersChanged =
    list.filters.filter((f) => f.hasChanged()).length > 0;

  return (
    <Views.ActiveFilterList
      onResetFilters={() => list.resetFilters()}
      onClearFilters={() => list.clearFilters()}
      onStoreFilterDefaultSettings={
        list.supportsSettingsStorage
          ? () => list.storeFilterDefaultSettings()
          : undefined
      }
      someFiltersChanged={someFiltersChanged}
    >
      {activeFilterValues.map((v) => (
        <Views.ActiveFilterItem onRemove={() => v.deactivate()} key={v.id}>
          {v.render()}
        </Views.ActiveFilterItem>
      ))}
    </Views.ActiveFilterList>
  );
});

export default ActiveFilterList;
