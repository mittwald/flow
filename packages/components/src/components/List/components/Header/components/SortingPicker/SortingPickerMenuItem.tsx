import type { FC } from "react";
import React from "react";
import type { Sorting } from "~/components/List/model/sorting/Sorting";
import { SortingPickerMenuItem as View } from "~/components/List/views/Header/SortingPicker/SortingPickerMenuItem/SortingPickerMenuItem";

interface Props {
  sorting: Sorting<never>;
}

export const SortingPickerMenuItem: FC<Props> = (props) => {
  const { sorting } = props;

  return <View id={sorting.id}>{sorting.name}</View>;
};
