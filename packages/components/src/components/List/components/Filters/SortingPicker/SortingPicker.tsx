import React, { FC } from "react";
import { SortingPickerItem } from "@/components/List/components/Filters/SortingPickerItem";
import { useList } from "@/components/List/hooks/useList";
import * as Aria from "react-aria-components";
import { Text } from "@/components/Text";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";
import { ContextMenu } from "@/components/ContextMenu";
import locales from "../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export const SortingPicker: FC = () => {
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales);

  const pickerItems = list.sorting.map((s) => (
    <SortingPickerItem sorting={s} key={s.getTableColumn().id} />
  ));

  if (list.sorting.length === 0) {
    return null;
  }

  return (
    <Aria.MenuTrigger>
      <Button style="soft" size="s" variant="secondary">
        <Text>{stringFormatter.format("sorting")}</Text>
        <IconChevronDown />
      </Button>
      <ContextMenu
        onAction={(columnId) => {
          list.reactTable.getTableColumn(String(columnId)).toggleSorting();
        }}
      >
        {pickerItems}
      </ContextMenu>
    </Aria.MenuTrigger>
  );
};
