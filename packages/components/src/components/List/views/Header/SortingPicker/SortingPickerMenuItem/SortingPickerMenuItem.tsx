export * from "./view";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { MenuItem } from "~/components/ContextMenu";

export interface SortingPickerMenuItemProps extends PropsWithChildren {
  id: string;
}

/** @flr-generate all */
export const SortingPickerMenuItem: FC<SortingPickerMenuItemProps> = (
  props,
) => {
  const { id, children } = props;

  return <MenuItem id={id}>{children}</MenuItem>;
};
