import type { FC, PropsWithChildren, ReactNode } from "react";
import React from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import type { ContextMenuProps } from "@/components/ContextMenu";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { IconFilter } from "@/components/Icon/components/icons";

interface Props
  extends Pick<ContextMenuProps, "selectionMode" | "selectedKeys">,
    PropsWithChildren {
  buttonText?: ReactNode;
}

export const FilterPicker: FC<Props> = (props) => {
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
