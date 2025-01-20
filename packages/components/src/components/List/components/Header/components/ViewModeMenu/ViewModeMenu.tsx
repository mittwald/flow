import ContextMenu, {
  ContextMenuSection,
  ContextMenuTrigger,
} from "@/components/ContextMenu";
import type { FC } from "react";
import React from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Heading } from "@/components/Heading";
import MenuItem from "@/components/MenuItem";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { IconView } from "@/components/Icon/components/icons";
import { useList } from "@/components/List";
import type { ListViewMode } from "@/components/List/model/types";

export const ViewModeMenu: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales);
  const list = useList();
  const selectedViewMode = list.viewMode;

  const availableViewModes: ListViewMode[] = [];
  if (list.itemView) {
    availableViewModes.push("list");
  }
  if (list.table) {
    availableViewModes.push("table");
  }
  if (list.tiles) {
    availableViewModes.push("tiles");
  }

  if (availableViewModes.length <= 1) {
    return null;
  }

  return (
    <ContextMenuTrigger>
      <Button
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.settings")}
      >
        <Text>
          {stringFormatter.format(`list.settings.viewMode.${selectedViewMode}`)}
        </Text>
        <IconView />
      </Button>
      <ContextMenu selectedKeys={[selectedViewMode]}>
        <ContextMenuSection selectionMode="single">
          <Heading>{stringFormatter.format("list.settings.viewMode")}</Heading>
          {availableViewModes.map((viewMode) => (
            <MenuItem
              id={viewMode}
              key={viewMode}
              onAction={() => {
                list.setViewMode(viewMode);
              }}
            >
              {stringFormatter.format(`list.settings.viewMode.${viewMode}`)}
            </MenuItem>
          ))}
        </ContextMenuSection>
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
