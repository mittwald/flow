import MenuItemView from "@/views/MenuItemView";
import TextView from "@/views/TextView";
import type { FC } from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import styles from "./FilterSelectAll.module.scss";

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
      className={styles.selectAll}
      isIndeterminate={filter.isActive() && !isEveryValueActive}
      onAction={() =>
        isEveryValueActive ? filter.deselectAll() : filter.selectAll()
      }
    >
      <TextView>
        {formatter.format(
          isEveryValueActive ? "filters.deselectAll" : "filters.selectAll",
        )}
      </TextView>
    </MenuItemView>
  );
};
