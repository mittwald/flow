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
import { IconChevronDown } from "@/components/Icon/components/icons";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterPicker: FC<Props> = (props) => {
  const { filter } = props;

  const { renderItem, values, mode, name, property } = filter;

  const items = values.map((v) => (
    <MenuItem
      key={filter.getValueId(v)}
      id={JSON.stringify(v)}
      onAction={() => {
        filter.toggleValue(v);
      }}
    >
      {renderItem(v as never)}
    </MenuItem>
  ));

  const activeFilterValues = values
    .filter((v) => filter.isValueActive(v))
    .map((v) => JSON.stringify(v));

  return (
    <ContextMenuTrigger>
      <Button variant="soft" size="s" color="secondary">
        <Text>{name ?? property}</Text>
        <IconChevronDown />
      </Button>
      <ContextMenu
        selectionMode={mode === "one" ? "single" : "multiple"}
        selectedKeys={activeFilterValues}
      >
        {items}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
