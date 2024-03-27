import React, { FC, PropsWithChildren } from "react";
import { Button } from "@/components/Button";
import { IconContextMenu } from "@/components/Icon/components/icons";
import { useProps } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { ContextMenu } from "@/components/ContextMenu";
import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export interface ListItemContextMenuProps extends PropsWithChildren {
  className?: string;
}

export const ListItemContextMenu: FC<ListItemContextMenuProps> = (props) => {
  const { className, children } = useProps("ListItemContextMenu", props);
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Aria.MenuTrigger>
      <Button
        style="plain"
        className={className}
        aria-label={stringFormatter.format("options")}
      >
        <IconContextMenu />
      </Button>
      <ContextMenu placement="bottom end">{children}</ContextMenu>
    </Aria.MenuTrigger>
  );
};

export default ListItemContextMenu;
