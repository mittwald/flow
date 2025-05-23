import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import ContextMenu, { ContextMenuTrigger } from "@/components/ContextMenu";
import locales from "../../../../locales/*.locale.json";
import { Translate } from "@/lib/react/components/Translate";
import TextView from "@/views/TextView";
import ButtonView from "@/views/ButtonView";
import { IconSorting } from "@/components/Icon/components/icons";
import styles from "@/components/List/components/Header/Header.module.css";
import { SortingMenuItem } from "@/components/List/components/Header/components/Settings/SortingMenuItem";

export const SortingMenu: FC = () => {
  const list = useList();

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
        <Translate locales={locales}>list.sorting</Translate>
      )}
    </TextView>
  );

  return (
    <ContextMenuTrigger>
      <ButtonView
        variant="outline"
        color="secondary"
        className={styles.desktop}
      >
        {text}
        <IconSorting />
      </ButtonView>
      <ContextMenu
        selectionMode="single"
        selectedKeys={labelSorting ? [labelSorting.id] : []}
      >
        {sortingItems}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
