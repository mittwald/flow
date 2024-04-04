import React, { FC } from "react";
import { Filter } from "@/components/List/model/filter/Filter";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import * as Aria from "react-aria-components";
import { AnyData } from "@/components/List/model/item/types";
import { ContextMenu, ContextMenuItem } from "@/components/ContextMenu";
import { IconChevronDown } from "@/components/Icon/components/icons";

interface Props {
  filter: Filter<AnyData>;
}

export const FilterPicker: FC<Props> = (props) => {
  const { filter } = props;

  const items = filter.values
    .filter((v) => !filter.isValueActive(v))
    .map((v) => (
      <ContextMenuItem key={filter.getValueId(v)} id={String(v)}>
        {String(v)}
      </ContextMenuItem>
    ));

  return (
    <Aria.MenuTrigger>
      <Button style="soft" size="s" variant="secondary">
        <Text>{filter.name ?? filter.property}</Text>
        <IconChevronDown />
      </Button>
      <ContextMenu onAction={(key) => filter.activateValue(key)}>
        {items}
      </ContextMenu>
    </Aria.MenuTrigger>
  );
};
