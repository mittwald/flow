import type { FC } from "react";
import React from "react";
import { IconFilter } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import { useList } from "@/components/List";
import styles from "@/components/List/components/Header/Header.module.css";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";
import ModalTriggerView from "@/views/ModalTriggerView";
import ModalView from "@/views/ModalView";
import ContentView from "@/views/ContentView";
import SectionView from "@/views/SectionView";
import { FilterAccordion } from "@/components/List/components/Header/components/AllFiltersModal/FilterAccordion";
import { ViewModeAccordion } from "@/components/List/components/Header/components/AllFiltersModal/ViewModeAccordion";
import TextView from "@/views/TextView";

export const AllFiltersModal: FC = () => {
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales);

  const filterAccordions = list.filters.map((f) => (
    <FilterAccordion filter={f} />
  ));

  /*
  const sortingItems = list.visibleSorting.map((s) => (
    <SortingMenuItem key={s.id} sorting={s} />
  ));
  
 */
  //const labelSorting = list.visibleSorting.find((s) => s.isSorted());
  const sortingSection = /*
    sortingItems.length > 0 ? (
      <ContextMenuSectionView
        selectionMode="single"
        selectedKeys={labelSorting ? [labelSorting.id] : []}
      >
        <HeadingView>{stringFormatter.format("list.sorting")}</HeadingView>
        {sortingItems}
      </ContextMenuSectionView>
    ) : */ null;

  const accordions = [
    <ViewModeAccordion />,
    sortingSection,
    ...filterAccordions,
  ].filter(Boolean);

  const hasSecondaryFilters = list.filters.find(
    (f) => f.visibility === "secondary",
  );

  if (accordions.length === 0) return null;

  return (
    <ModalTriggerView>
      <ButtonView
        className={hasSecondaryFilters ? undefined : styles.hideOnDesktop}
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.filters")}
      >
        <TextView className={styles.hideOnMobile}>
          {stringFormatter.format("list.allFilters")}
        </TextView>
        <IconFilter />
      </ButtonView>

      <ModalView offCanvas>
        <ContentView>
          <SectionView>{...accordions}</SectionView>
        </ContentView>
      </ModalView>
    </ModalTriggerView>
  );
};
