import type { FC } from "react";
import React from "react";
import { SortingPickerItem } from "@/components/List/components/Header/SortingPickerItem";
import { useList } from "@/components/List/hooks/useList";
import { Text } from "@/components/Text";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
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

  const enabledSorting = list.sorting.find((s) => s.isSorted());

  const text = (
    <Text>
      {enabledSorting ? (
        <Translate
          locales={locales}
          variables={{
            property: enabledSorting.name ?? enabledSorting.property,
          }}
        >
          list.setSorting
        </Translate>
      ) : (
        <Translate locales={locales}>list.sorting</Translate>
      )}
    </Text>
  );

  return (
    <ContextMenuTrigger>
      <Button variant="soft" size="s" color="secondary">
        {text}
        <IconChevronDown />
      </Button>
      <ContextMenu
        selectionMode="single"
        selectedKeys={enabledSorting ? [enabledSorting.property] : []}
        onAction={(columnId) => {
          list.getSorting(String(columnId)).enable();
        }}
      >
        {pickerItems}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
