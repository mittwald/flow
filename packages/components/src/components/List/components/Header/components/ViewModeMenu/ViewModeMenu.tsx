import ContextMenu, { ContextMenuTrigger } from "~/components/ContextMenu";
import type { FC } from "react";
import React from "react";
import { Button } from "~/components/Button";
import { Text } from "~/components/Text";
import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import MenuItem from "~/components/MenuItem";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { useList } from "~/components/List";
import type { ListViewMode } from "~/components/List/model/types";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";
import { IconView } from "~/components/Icon/components/icons";

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

  const {
    ButtonView,
    ContextMenuView,
    HeadingView,
    SectionView,
    TextView,
    MenuItemView,
    ContextMenuTriggerView,
  } = useViewComponents(
    ["Button", Button],
    ["Text", Text],
    ["ContextMenu", ContextMenu],
    ["ContextMenuTrigger", ContextMenuTrigger],
    ["Section", Section],
    ["Heading", Heading],
    ["MenuItem", MenuItem],
  );

  if (availableViewModes.length <= 1) {
    return null;
  }

  return (
    <ContextMenuTriggerView>
      <ButtonView
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.settings")}
      >
        <TextView>
          {stringFormatter.format(`list.settings.viewMode.${selectedViewMode}`)}
        </TextView>
        <IconView />
      </ButtonView>
      <ContextMenuView selectionMode="single" selectedKeys={[selectedViewMode]}>
        <SectionView>
          <HeadingView>
            {stringFormatter.format("list.settings.viewMode")}
          </HeadingView>
          {availableViewModes.map((viewMode) => (
            <MenuItemView
              id={viewMode}
              key={viewMode}
              onAction={() => {
                list.setViewMode(viewMode);
              }}
            >
              {stringFormatter.format(`list.settings.viewMode.${viewMode}`)}
            </MenuItemView>
          ))}
        </SectionView>
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
