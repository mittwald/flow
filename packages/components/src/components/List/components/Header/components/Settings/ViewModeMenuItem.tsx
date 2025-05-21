import React, { type FC } from "react";
import MenuItemView from "@/views/MenuItemView";
import type { ListViewMode } from "@/components/List/model/types";
import { useList } from "@/components/List";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";

interface Props {
  viewMode: ListViewMode;
}

export const ViewModeMenuItem: FC<Props> = (props) => {
  const { viewMode } = props;
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <MenuItemView
      id={viewMode}
      key={viewMode}
      onAction={() => {
        list.setViewMode(viewMode);
      }}
    >
      {stringFormatter.format(`list.settings.viewMode.${viewMode}`)}
    </MenuItemView>
  );
};
