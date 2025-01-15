import type { FC } from "react";
import React from "react";
import type { Filter } from "~/components/List/model/filter/Filter";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import * as ListViews from "~/components/List/views";
import Fragment from "~/components/Fragment";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterPicker: FC<Props> = (props) => {
  const { filter } = props;

  const Views = {
    FilterPicker: useViewComponent(
      "ListFilterPickerView",
      ListViews.FilterPicker,
    ),
    FilterPickerMenuItem: useViewComponent(
      "ListFilterPickerMenuItemView",
      ListViews.FilterPickerMenuItem,
    ),
    Fragment: useViewComponent("Fragment", Fragment),
  };

  const { values, mode, name, property } = filter;

  const activeFilterKeys = values.filter((v) => v.isActive).map((v) => v.id);

  return (
    <Views.FilterPicker
      selectionMode={mode === "one" ? "single" : "multiple"}
      selectedKeys={activeFilterKeys}
      buttonText={<Views.Fragment>{name ?? property}</Views.Fragment>}
    >
      {values.map((v) => (
        <Views.FilterPickerMenuItem
          id={v.id}
          key={v.id}
          onAction={() => {
            v.toggle();
          }}
        >
          {v.render()}
        </Views.FilterPickerMenuItem>
      ))}
    </Views.FilterPicker>
  );
};
