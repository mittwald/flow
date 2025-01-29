import type { FC } from "react";
import React from "react";
import { SortingPickerItem } from "~/components/List/components/Header/components/SortingPickerItem";
import { useList } from "~/components/List/hooks/useList";
import ContextMenu, { ContextMenuTrigger } from "~/components/ContextMenu";
import locales from "../../../../locales/*.locale.json";
import { Translate } from "~/lib/react/components/Translate";
import TextView from "~/views/TextView";
import ButtonView from "~/views/ButtonView";
import { IconSorting } from "~/components/Icon/components/icons";

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
    <TextView>
      {pickerLabelSorting ? (
        <>{pickerLabelSorting.name ?? pickerLabelSorting.property}</>
      ) : (
        <Translate locales={locales}>list.sorting</Translate>
      )}
    </TextView>
  );

  return (
    <ContextMenuTrigger>
      <ButtonView variant="outline" color="secondary">
        {text}
        <IconSorting />
      </ButtonView>
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
