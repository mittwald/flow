import type { FC } from "react";
import React from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { IconFilter } from "@/components/Icon/components/icons";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterPicker: FC<Props> = (props) => {
  const { filter } = props;

  const { values, mode, name, property } = filter;

  const items = values.map((v) => (
    <MenuItem
      id={v.id}
      key={v.id}
      onAction={() => {
        v.toggle();
      }}
    >
      {v.render()}
    </MenuItem>
  ));

  const activeFilterKeys = values.filter((v) => v.isActive).map((v) => v.id);

  return (
    <ContextMenuTrigger>
      <Button variant="outline" color="secondary">
        <Text>{name ?? property}</Text>
        <IconFilter />
      </Button>
      <ContextMenu
        selectionMode={mode === "one" ? "single" : "multiple"}
        selectedKeys={activeFilterKeys}
      >
        {items}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
