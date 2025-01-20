import type { FC } from "react";
import React from "react";
import type { Filter } from "~/components/List/model/filter/Filter";
import { IconFilter } from "~/components/Icon/components/icons";
import MenuItemView from "~/views/MenuItemView";
import ContextMenuTriggerView from "~/views/ContextMenuTriggerView";
import TextView from "~/views/TextView";
import ContextMenuView from "~/views/ContextMenuView";
import ButtonView from "~/views/ButtonView";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterPicker: FC<Props> = (props) => {
  const { filter } = props;

  const { values, mode, name, property } = filter;

  const items = values.map((v) => (
    <MenuItemView
      id={v.id}
      key={v.id}
      onAction={() => {
        v.toggle();
      }}
    >
      {v.render()}
    </MenuItemView>
  ));

  const activeFilterKeys = values.filter((v) => v.isActive).map((v) => v.id);

  return (
    <ContextMenuTriggerView>
      <ButtonView variant="outline" color="secondary">
        <TextView>{name ?? property}</TextView>
        <IconFilter />
      </ButtonView>
      <ContextMenuView
        selectionMode={mode === "one" ? "single" : "multiple"}
        selectedKeys={activeFilterKeys}
      >
        {items}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
