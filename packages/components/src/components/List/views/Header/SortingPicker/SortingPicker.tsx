import type { FC, PropsWithChildren } from "react";
import React, { Children } from "react";
import { Text } from "@/components/Text";
import { IconSorting } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";
import type { ContextMenuProps } from "@/components/ContextMenu";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";

export interface SortingPickerProps
  extends PropsWithChildren,
    Pick<ContextMenuProps, "onAction" | "selectedKeys"> {
  buttonText: string;
}

/** @flr-generate all */
export const SortingPicker: FC<SortingPickerProps> = (props) => {
  const { children, buttonText, ...contextMenuProps } = props;

  if (Children.count(children) === 0) {
    return null;
  }

  return (
    <ContextMenuTrigger>
      <Button variant="outline" color="secondary">
        <Text>{buttonText}</Text>
        <IconSorting />
      </Button>
      <ContextMenu selectionMode="single" {...contextMenuProps}>
        {children}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
