import type { FC, PropsWithChildren } from "react";
import React from "react";
import { MenuItem } from "@/components/ContextMenu";

interface Props extends PropsWithChildren {
  id: string;
}

export const SortingPickerMenuItem: FC<Props> = (props) => {
  const { id, children } = props;

  return <MenuItem id={id}>{children}</MenuItem>;
};
