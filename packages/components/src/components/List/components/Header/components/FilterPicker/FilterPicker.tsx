import type { FC } from "react";
import React from "react";
import type { Filter } from "~/components/List/model/filter/Filter";
import { FilterPicker as FilterPickerView } from "~/components/List/views/Header/FilterPicker/FilterPicker";
import { FilterPickerMenuItem as FilterPickerMenuItemView } from "~/components/List/views/Header/FilterPicker/FilterPickerMenuItem";
import Fragment from "~/components/Fragment";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponents";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterPicker: FC<Props> = (props) => {
  const { filter } = props;

  const {
    FilterPicker: View = FilterPickerView,
    FilterPickerMenuItem: ItemView = FilterPickerMenuItemView,
    Fragment: FragmentView = Fragment,
  } = useViewComponents("List");

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
