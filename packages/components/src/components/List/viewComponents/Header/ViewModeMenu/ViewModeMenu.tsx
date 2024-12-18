import ContextMenu, { ContextMenuTrigger } from "@/components/ContextMenu";
import type { FC } from "react";
import React from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import MenuItem from "@/components/MenuItem";
import locales from "../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { IconView } from "@/components/Icon/components/icons";
import type { ListViewMode } from "@/components/List/model/types";

interface Props {
  selectedViewMode: ListViewMode;
  availableViewModes: ListViewMode[];
  onViewModeSelected?: (viewMode: ListViewMode) => void;
}

export const ViewModeMenu: FC<Props> = (props) => {
  const { selectedViewMode, availableViewModes, onViewModeSelected } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

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
              onAction={() => onViewModeSelected?.(viewMode)}
            >
              {stringFormatter.format(`list.settings.viewMode.${viewMode}`)}
            </MenuItem>
          ))}
        </Section>
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
