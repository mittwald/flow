import type { FC } from "react";
import React from "react";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { useList } from "@/components/List";
import type { ListViewMode } from "@/components/List/model/types";
import { IconView } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import TextView from "@/views/TextView";
import SectionView from "@/views/SectionView";
import MenuItemView from "@/views/MenuItemView";
import HeadingView from "@/views/HeadingView";
import ContextMenu, { ContextMenuTrigger } from "@/components/ContextMenu";

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

  if (availableViewModes.length <= 1) {
    return null;
  }

  return (
    <ContextMenuTrigger>
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
      <ContextMenu selectionMode="single" selectedKeys={[selectedViewMode]}>
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
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
