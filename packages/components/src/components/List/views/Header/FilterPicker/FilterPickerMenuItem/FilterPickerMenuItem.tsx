export * from "./view";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { MenuItem } from "~/components/ContextMenu";

export interface FilterPickerMenuItemProps extends PropsWithChildren {
  onAction?: () => void;
  id: string;
}

/** @flr-generate all */
export const FilterPickerMenuItem: FC<FilterPickerMenuItemProps> = (props) => {
  const { id, onAction, children } = props;

  return (
    <MenuItem id={id} onAction={onAction} key={id}>
      {children}
    </MenuItem>
  );
};
