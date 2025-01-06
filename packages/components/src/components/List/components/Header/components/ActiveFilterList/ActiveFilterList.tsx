import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import { observer } from "mobx-react-lite";
import ActiveFilterItemView from "@/components/List/viewComponents/Header/ActiveFilters/ActiveFilterItem";
import ActiveFilterListView from "@/components/List/viewComponents/Header/ActiveFilters/ActiveFilterList";
import { useListViewComponents } from "@/components/List";

export const ActiveFilterList: FC = observer(() => {
  const list = useList();

  const {
    activeFilterList: View = ActiveFilterListView,
    activeFilterItem: ItemView = ActiveFilterItemView,
  } = useListViewComponents();

  const activeFilterValues = list.filters
    .flatMap((f) => f.values)
    .filter((v) => v.isActive);

  const someFiltersChanged =
    list.filters.filter((f) => f.hasChanged()).length > 0;

  return (
    <View
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
        <ItemView onRemove={() => v.deactivate()} key={v.id}>
          {v.render()}
        </ItemView>
      ))}
    </View>
  );
});

export default ActiveFilterList;
