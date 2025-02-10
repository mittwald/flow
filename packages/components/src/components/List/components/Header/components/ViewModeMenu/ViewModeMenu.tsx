import ContextMenu, { ContextMenuTrigger } from "@/components/ContextMenu";
import type { FC } from "react";
import React from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import MenuItem from "@/components/MenuItem";
import locales from "../../../../locales/*.locale.json";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";
import { IconView } from "@/components/Icon/components/icons";
import { useList } from "@/components/List";
import type { ListViewMode } from "@/components/List/model/types";

export const ViewModeMenu: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales);
  const list = useList();
  const selectedViewMode = list.viewMode;

  const availableViewModes: ListViewMode[] = [];
  if (list.itemView?.showList) {
    availableViewModes.push("list");
  }
  if (list.table) {
    availableViewModes.push("table");
  }
  if (list.itemView?.showTiles) {
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
      <ContextMenu selectionMode="single" selectedKeys={[selectedViewMode]}>
        <Section>
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
        </Section>
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
