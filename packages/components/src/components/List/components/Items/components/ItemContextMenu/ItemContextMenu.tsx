import React, { FC, PropsWithChildren } from "react";
import { Button } from "@/components/Button";
import { IconContextMenu } from "@/components/Icon/components/icons";
import { useProps } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { ContextMenu } from "@/components/ContextMenu";

export interface ItemContextMenuProps extends PropsWithChildren {
  className?: string;
}

export const ItemContextMenu: FC<ItemContextMenuProps> = (props) => {
  const { className, children } = useProps("ListItemContextMenu", props);

  return (
    <Aria.MenuTrigger>
      <Button style="plain" className={className}>
        <IconContextMenu />
      </Button>
      <ContextMenu>{children}</ContextMenu>
    </Aria.MenuTrigger>
  );
};

export default ItemContextMenu;
