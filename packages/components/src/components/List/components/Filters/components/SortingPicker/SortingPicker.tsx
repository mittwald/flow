import React, { FC } from "react";
import { SortingPickerItem } from "@/components/List/components/Filters/components/SortingPickerItem";
import { useList } from "@/components/List/hooks/useList";
import * as Aria from "react-aria-components";
import { Text } from "@/components/Text";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";
import { ContextMenu } from "@/components/ContextMenu";

export const SortingPicker: FC = () => {
  const { sorting } = useList();

  const pickerItems = sorting.map((s) => (
    <SortingPickerItem sorting={s} key={s.getTableColumn().id} />
  ));

  return (
    <Aria.MenuTrigger>
      <Button style="soft" size="s" variant="secondary">
        <Text>sort</Text>
        <IconChevronDown />
      </Button>
      <ContextMenu
      //onAction={(s) => s.getTableColumn().getToggleSortingHandler()}
      >
        {pickerItems}
      </ContextMenu>
    </Aria.MenuTrigger>
  );
};
