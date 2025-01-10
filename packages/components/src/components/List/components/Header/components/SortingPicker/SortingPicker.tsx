import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import locales from "../../../../locales/*.locale.json";
import { SortingPicker as View } from "@/components/List/views/Header/SortingPicker/SortingPicker";
import { useLocalizedStringFormatter } from "react-aria";
import { SortingPickerMenuItem } from "@/components/List/components/Header/components/SortingPicker/SortingPickerMenuItem";

export const SortingPicker: FC = () => {
  const list = useList();

  const pickerItems = list.visibleSorting.map((s) => (
    <SortingPickerMenuItem sorting={s} key={s.id} />
  ));

  const stringFormatter = useLocalizedStringFormatter(locales);

  if (pickerItems.length === 0) {
    return null;
  }

  const pickerLabelSorting = list.visibleSorting.find((s) => s.isSorted());

  const text = pickerLabelSorting
    ? (pickerLabelSorting.name ?? pickerLabelSorting.property)
    : stringFormatter.format("list.sorting");

  return (
    <View
      buttonText={text}
      selectedKeys={pickerLabelSorting ? [pickerLabelSorting.id] : []}
      onAction={(id) => {
        list.getSorting(String(id)).enable();
      }}
    />
  );
};
