"use client";
import type { FC } from "react";
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Icon,
  MenuItem,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { IconAdjustments } from "@tabler/icons-react";
import { useComponentGrouping } from "@/app/_lib/componentGrouping";

const groupedKey = "grouped";

export const ComponentGroupingMenu: FC = () => {
  const { grouping, setGrouping } = useComponentGrouping();
  const controller = useOverlayController("ContextMenu", {
    reuseControllerFromContext: false,
  });

  return (
    <ContextMenuTrigger controller={controller}>
      <Button variant="plain" color="secondary" aria-label="Einstellungen">
        <Icon>
          <IconAdjustments />
        </Icon>
      </Button>
      <ContextMenu
        placement="bottom right"
        selectionMode="switch"
        selectedKeys={grouping === "grouped" ? [groupedKey] : []}
        onSelectionChange={(keys) => {
          setGrouping(
            keys === "all" || keys.has(groupedKey) ? "grouped" : "alphabetical",
          );
          controller.close();
        }}
      >
        <MenuItem id={groupedKey}>Gruppiert</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  );
};

export default ComponentGroupingMenu;
