import { type FC } from "react";
import MenuItemView from "@/views/MenuItemView";
import type { ListViewMode } from "@/components/List/model/types";
import { useList } from "@/components/List";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";

interface Props {
  viewMode: ListViewMode;
}

export const ViewModeMenuItem: FC<Props> = (props) => {
  const { viewMode } = props;
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  return (
    <MenuItemView
      id={viewMode}
      onAction={() => {
        list.viewMode.set(viewMode);
      }}
    >
      {stringFormatter.format(`settings.viewMode.${viewMode}`)}
    </MenuItemView>
  );
};
