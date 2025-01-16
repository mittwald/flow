import type { FC } from "react";
import React from "react";
import type { Filter } from "~/components/List/model/filter/Filter";
import { Button } from "~/components/Button";
import { Text } from "~/components/Text";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "~/components/ContextMenu";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";
import { IconFilter } from "~/components/Icon/components/icons";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterPicker: FC<Props> = (props) => {
  const { filter } = props;

  const { values, mode, name, property } = filter;

  const {
    MenuItemView,
    ContextMenuView,
    ButtonView,
    TextView,
    ContextMenuTriggerView,
  } = useViewComponents(
    ["MenuItem", MenuItem],
    ["Button", Button],
    ["Text", Text],
    ["ContextMenu", ContextMenu],
    ["ContextMenuTrigger", ContextMenuTrigger],
  );

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
