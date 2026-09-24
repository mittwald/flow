import MenuItemView from "@/views/MenuItemView";
import TextView from "@/views/TextView";
import type { FC } from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";

export const filterSelectAllMenuItemId = "FilterSelectAll";

interface Props {
  filter: Filter;
}

export const FilterSelectAllMenuItem: FC<Props> = (props) => {
  const { filter } = props;
  const formatter = useLocalizedStringFormatter(locales, "List");

  const isEveryValueActive = filter.isEveryValueActive();

  return (
    <MenuItemView
      id={filterSelectAllMenuItemId}
      isIndeterminate={filter.isActive() && !isEveryValueActive}
      onAction={() =>
        isEveryValueActive ? filter.deselectAll() : filter.selectAll()
      }
    >
      <TextView>{formatter.format("filters.selectAll")}</TextView>
    </MenuItemView>
  );
};
