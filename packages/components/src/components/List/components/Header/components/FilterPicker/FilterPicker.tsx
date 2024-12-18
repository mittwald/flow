import type { FC } from "react";
import React from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import { FilterPicker as FilterPickerView } from "@/components/List/viewComponents/Header/FilterPicker/FilterPicker";
import { FilterPickerMenuItem as FilterPickerMenuItemView } from "@/components/List/viewComponents/Header/FilterPicker/FilterPickerMenuItem";
import { useListViewComponents } from "@/components/List";
import Fragment from "@/components/Fragment";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterPicker: FC<Props> = (props) => {
  const { filter } = props;

  const {
    filterPicker: View = FilterPickerView,
    filterPickerMenuItem: ItemView = FilterPickerMenuItemView,
    fragment: FragmentView = Fragment,
  } = useListViewComponents();

  const { values, mode, name, property } = filter;

  const activeFilterKeys = values.filter((v) => v.isActive).map((v) => v.id);

  return (
    <View
      selectionMode={mode === "one" ? "single" : "multiple"}
      selectedKeys={activeFilterKeys}
      buttonText={<FragmentView>{name ?? property}</FragmentView>}
    >
      {values.map((v) => (
        <ItemView
          id={v.id}
          key={v.id}
          onAction={() => {
            v.toggle();
          }}
        >
          {v.render()}
        </ItemView>
      ))}
    </View>
  );
};
