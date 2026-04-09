import type { FC } from "react";
import { useList } from "@/components/List/hooks/useList";
import locales from "../../../../locales/*.locale.json";
import TextView from "@/views/TextView";
import ButtonView from "@/views/ButtonView";
import {
  IconAscending,
  IconDescending,
  IconSorting,
} from "@/components/Icon/components/icons";
import styles from "@/components/List/components/Header/Header.module.css";
import { SortingMenuItem } from "@/components/List/components/Header/components/SortingContextMenu/SortingMenuItem";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";

export const SortingContextMenu: FC = () => {
  const list = useList();
  const formatter = useLocalizedStringFormatter(locales, "List");

  const sortingItems = list.visibleSorting.map((s) => (
    <SortingMenuItem sorting={s} key={s.id} />
  ));

  if (sortingItems.length === 0) {
    return null;
  }

  const labelSorting = list.visibleSorting.find((s) => s.isSorted());

  const text = (
    <TextView>
      {labelSorting ? (
        <>{labelSorting.name ?? labelSorting.property}</>
      ) : (
        formatter.format("sorting")
      )}
    </TextView>
  );

  const icon = !labelSorting ? (
    <IconSorting />
  ) : labelSorting?.direction === "asc" ? (
    <IconAscending />
  ) : (
    <IconDescending />
  );

  return (
    <ContextMenuTriggerView>
      <ButtonView
        variant="outline"
        color="secondary"
        className={styles.hideOnMobile}
      >
        {text}
        {icon}
      </ButtonView>
      <ContextMenuView
        selectionMode="single"
        selectedKeys={labelSorting ? [labelSorting.id] : []}
      >
        {sortingItems}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
