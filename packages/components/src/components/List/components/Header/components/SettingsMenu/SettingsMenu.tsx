import ContextMenu, { ContextMenuTrigger } from "@/components/ContextMenu";
import type { FC } from "react";
import React from "react";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import MenuItem from "@/components/MenuItem";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { IconSettings } from "@/components/Icon/components/icons";
import { useList } from "@/components/List";
import type { ListViewMode } from "@/components/List/model/types";

export const SettingsMenu: FC = () => {
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

  if (availableViewModes.length <= 1) {
    return null;
  }

  return (
    <ContextMenuTrigger>
      <Button
        variant="plain"
        color="secondary"
        aria-label={stringFormatter.format("list.settings")}
      >
        <IconSettings />
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
