import type { FC } from "react";
import React from "react";
import { SortingPickerItem } from "@/components/List/components/Header/components/SortingPickerItem";
import { useList } from "@/components/List/hooks/useList";
import { Text } from "@/components/Text";
import { IconSorting } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import locales from "../../../../locales/*.locale.json";
import { Translate } from "@/lib/react/components/Translate";

export const SortingPicker: FC = () => {
  const list = useList();

  const pickerItems = list.visibleSorting.map((s) => (
    <SortingPickerItem sorting={s} key={s.id} />
  ));

  if (pickerItems.length === 0) {
    return null;
  }

  const pickerLabelSorting = list.visibleSorting.find((s) => s.isSorted());

  const text = (
    <Text>
      {pickerLabelSorting ? (
        <>{pickerLabelSorting.name ?? pickerLabelSorting.property}</>
      ) : (
        <Translate locales={locales}>list.sorting</Translate>
      )}
    </Text>
  );

  return (
    <ContextMenuTrigger>
      <Button variant="outline" color="secondary">
        {text}
        <IconSorting />
      </Button>
      <ContextMenu
        selectionMode="single"
        selectedKeys={pickerLabelSorting ? [pickerLabelSorting.id] : []}
        onAction={(id) => {
          list.getSorting(String(id)).enable();
        }}
      >
        {pickerItems}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
