import type { FC, PropsWithChildren, ReactNode } from "react";
import React from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import type { ContextMenuProps } from "@/components/ContextMenu";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { IconFilter } from "@/components/Icon/components/icons";

export interface FilterPickerProps
  extends Pick<ContextMenuProps, "selectionMode" | "selectedKeys">,
    PropsWithChildren {
  buttonText?: ReactNode;
}

/**
 * @flr-generate all
 * @flr-slot-props buttonText
 */
export const FilterPicker: FC<FilterPickerProps> = (props) => {
  const { buttonText, children, ...contextMenuProps } = props;

  return (
    <ContextMenuTrigger>
      <Button variant="outline" color="secondary">
        <Text>{buttonText}</Text>
        <IconFilter />
      </Button>
      <ContextMenu {...contextMenuProps}>{children}</ContextMenu>
    </ContextMenuTrigger>
  );
};
