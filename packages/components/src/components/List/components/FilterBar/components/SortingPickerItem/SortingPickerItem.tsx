import type { FC } from "react";
import React from "react";
import { Button } from "@/components/Button";
import {
  IconChevronDown,
  IconChevronUp,
} from "@/components/Icon/components/icons";
import { Empty } from "@/lib/react/components/Empty";

import type { AnyData } from "@/components/List/model/item/types";
import type { Sorting } from "@/components/List/model/sorting/Sorting";

interface Props {
  sorting: Sorting<AnyData>;
}

export const SortingPickerItem: FC<Props> = (props) => {
  const { sorting } = props;

  const direction = sorting.direction;

  const SortingIcon =
    direction === "asc"
      ? IconChevronUp
      : direction === "desc"
        ? IconChevronDown
        : Empty;

  const isSorted = direction !== false;

  return (
    <Button
      variant={isSorted ? "primary" : "secondary"}
      onPress={sorting.getTableColumn().getToggleSortingHandler()}
    >
      {sorting.getTableColumn().id}
      <SortingIcon size="s" />
    </Button>
  );
};
