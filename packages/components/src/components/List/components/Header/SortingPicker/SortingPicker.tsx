import type { FC } from "react";
import React from "react";
import { SortingPickerItem } from "@/components/List/components/Header/SortingPickerItem";
import { useList } from "@/components/List/hooks/useList";
import * as Aria from "react-aria-components";
import { Text } from "@/components/Text";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";
import { ContextMenu } from "@/components/ContextMenu";
import locales from "../../../locales/*.locale.json";
import { Translate } from "@/lib/react/components/Translate";

export const SortingPicker: FC = () => {
  const list = useList();

  const pickerItems = list.sorting.map((s) => (
    <SortingPickerItem sorting={s} key={s.getTableColumn().id} />
  ));

  if (list.sorting.length === 0) {
    return null;
  }

  const enabledSortingProps = list.sorting
    .filter((s) => s.enabled)
    .map((s) => s.property);

  return (
    <Aria.MenuTrigger>
      <Button style="soft" size="s" variant="secondary">
        <Text>
          <Translate locales={locales}>sorting</Translate>
        </Text>
        <IconChevronDown />
      </Button>
      <ContextMenu
        selectionMode="single"
        selectedKeys={enabledSortingProps}
        onAction={(columnId) => {
          list.getSorting(String(columnId)).toggle();
        }}
      >
        {pickerItems}
      </ContextMenu>
    </Aria.MenuTrigger>
  );
};
