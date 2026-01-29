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
import { SortingAccordion } from "@/components/List/components/Header/components/AllFiltersModal/SortingAccordion";
import ActionGroupView from "@/views/ActionGroupView";
import { Render } from "@/lib/react/components/Render";
import { useOverlayController } from "@/lib/controller";
import HeadingView from "@/views/HeadingView";
import clsx from "clsx";

export const AllFiltersModal: FC = () => {
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales);

  const totalItemCount = list.items.entries.length;

  const filterAccordions = list.filters.map((f) => (
    <FilterAccordion filter={f} />
  ));

  const accordions = [
    <ViewModeAccordion />,
    <SortingAccordion />,
    ...filterAccordions,
  ].filter(Boolean);

  const hasSecondaryFilters = list.filters.find(
    (f) => f.priority === "secondary",
  );

  if (accordions.length === 0) {
    return null;
  }

  return (
    <ModalTriggerView>
      <ButtonView
        className={clsx(
          styles.hideOnMobile,
          hasSecondaryFilters ? undefined : styles.hideOnDesktop,
        )}
        variant="outline"
        color="secondary"
      >
        <TextView>{stringFormatter.format("list.filters.all")}</TextView>
        <IconFilter />
      </ButtonView>

      <ButtonView
        className={styles.hideOnDesktop}
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.filters.all")}
      >
        <IconFilter />
      </ButtonView>

      <ModalView offCanvas>
        <HeadingView>{stringFormatter.format("list.filters.all")}</HeadingView>
        <ContentView>
          <SectionView>{...accordions}</SectionView>
        </ContentView>
        <Render>
          {() => {
            const controller = useOverlayController("Modal");
            return (
              <ActionGroupView>
                <ButtonView onPress={() => controller.close()}>
                  {stringFormatter.format("list.results.show", {
                    totalItemCount,
                  })}
                </ButtonView>
                <ButtonView
                  color="secondary"
                  variant="soft"
                  onPress={() => {
                    list.resetFilters();
                    controller.close();
                  }}
                >
                  {stringFormatter.format("list.reset")}
                </ButtonView>
              </ActionGroupView>
            );
          }}
        </Render>
      </ModalView>
    </ModalTriggerView>
  );
};
