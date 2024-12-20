import type { FC, PropsWithChildren } from "react";
import React from "react";
import { MenuItem } from "@/components/ContextMenu";

interface Props extends PropsWithChildren {
  onAction?: () => void;
  id: string;
}

export const FilterPickerMenuItem: FC<Props> = (props) => {
  const { id, onAction, children } = props;

  return (
    <MenuItem id={id} onAction={onAction} key={id}>
      {children}
    </MenuItem>
  );
};
