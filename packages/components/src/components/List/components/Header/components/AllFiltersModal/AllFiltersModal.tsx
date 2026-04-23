import type { FC } from "react";
import { IconFilter } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import { useList } from "@/components/List";
import styles from "@/components/List/components/Header/Header.module.css";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";
import ContentView from "@/views/ContentView";
import SectionView from "@/views/SectionView";
import { FilterAccordion } from "@/components/List/components/Header/components/AllFiltersModal/FilterAccordion";
import { ViewModeAccordion } from "@/components/List/components/Header/components/AllFiltersModal/ViewModeAccordion";
import TextView from "@/views/TextView";
import { SortingAccordion } from "@/components/List/components/Header/components/AllFiltersModal/SortingAccordion";
import ActionGroupView from "@/views/ActionGroupView";
import { useOverlayController } from "@/lib/controller";
import HeadingView from "@/views/HeadingView";
import clsx from "clsx";
import Modal, { ModalTrigger } from "@/components/Modal";
import { SkeletonText } from "@/components/SkeletonText";
import { useAvailableViewModes } from "../../lib";

interface Props {
  isDisabled?: boolean;
}

export const AllFiltersModal: FC<Props> = (props) => {
  const { isDisabled } = props;
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const totalItemCount =
    list.batches.getTotalItemsCount() ?? list.items.entries.length;

  const filterAccordions = list.filters.map((f) => (
    <FilterAccordion filter={f} key={f.name} />
  ));

  const availableViewModes = useAvailableViewModes();

  const accordions = [
    availableViewModes.length > 1 && <ViewModeAccordion key="viewMode" />,
    list.sorting.length > 0 && <SortingAccordion key="sorting" />,
    ...filterAccordions,
  ].filter(Boolean);

  const hasSecondaryFilters = list.filters.some(
    (f) => f.priority === "secondary",
  );

  const controller = useOverlayController("Modal", {
    reuseControllerFromContext: false,
  });

  if (accordions.length === 0) {
    return null;
  }

  return (
    <ModalTrigger controller={controller}>
      <ButtonView
        className={clsx(
          styles.hideOnMobile,
          hasSecondaryFilters ? undefined : styles.hideOnDesktop,
        )}
        variant="outline"
        color="secondary"
        isDisabled={isDisabled}
      >
        <TextView>{stringFormatter.format("filters.all")}</TextView>
        <IconFilter />
      </ButtonView>

      <ButtonView
        className={styles.hideOnDesktop}
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("filters.all")}
      >
        <IconFilter />
      </ButtonView>

      <Modal offCanvas controller={controller}>
        <HeadingView>{stringFormatter.format("filters.all")}</HeadingView>
        <ContentView>
          <SectionView>{...accordions}</SectionView>
        </ContentView>

        <ActionGroupView>
          <ButtonView onPress={() => controller.close()}>
            <TextView>
              {isInitiallyLoading ? (
                <SkeletonText width="16ch" />
              ) : (
                stringFormatter.format("results.show", {
                  totalItemCount,
                })
              )}
            </TextView>
          </ButtonView>
          <ButtonView
            color="secondary"
            variant="soft"
            onPress={() => {
              list.resetFilters();
              controller.close();
            }}
          >
            {stringFormatter.format("reset")}
          </ButtonView>
        </ActionGroupView>
      </Modal>
    </ModalTrigger>
  );
};
