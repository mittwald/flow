import React, { FC, PropsWithChildren } from "react";
import { Button } from "@/components/Button";
import { IconContextMenu } from "@/components/Icon/components/icons";
import { useProps } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { ContextMenu } from "@/components/ContextMenu";
import locales from "*.locale.json";
import { useMessageFormatter } from "react-aria";

export interface ItemContextMenuProps extends PropsWithChildren {
  className?: string;
}

export const ItemContextMenu: FC<ItemContextMenuProps> = (props) => {
  const { className, children } = useProps("ListItemContextMenu", props);
  const stringFormatter = useMessageFormatter(locales);

  return (
    <Aria.MenuTrigger>
      <Button
        style="plain"
        className={className}
        aria-label={stringFormatter("options")}
      >
        <IconContextMenu />
      </Button>
      <ContextMenu placement="bottom end">{children}</ContextMenu>
    </Aria.MenuTrigger>
  );
};

export default ItemContextMenu;
