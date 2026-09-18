import {
  Accordion,
  ActionGroup,
  Button,
  Checkbox,
  CheckboxGroup,
  Content,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Section,
  SkeletonText,
  Text,
} from "@/auto-generated";
import { IconFilter } from "@/icons";
import { watchMobxValue } from "@/lib/mobxSelector";
import { Modal } from "@/overlays/Modal";
import { createOverlayController } from "@/overlays/overlayController";
import { ModalTrigger } from "@/overlays/triggers";
import { defineComponent, h, type VNodeChild } from "vue";
import { injectListModel, type AnyListModel } from "./listContext";
import { useListTexts, type ListTextFormatter } from "./locales";
import { listStyles } from "./styles";
import type { ListRendered } from "./types";

/*
 * What this modal needs of a filter and a sorting. Not the classes: a list of
 * concrete filters is not assignable to a list of generic ones — a row model
 * sits in a contravariant position deep inside `Column`.
 */
interface ModalFilterValue {
  readonly id: string;
  readonly isActive: boolean;
  toggle(): void;
  render(): ListRendered;
}

interface ModalFilter {
  readonly name?: string;
  readonly property: unknown;
  readonly mode: string;
  readonly priority: "primary" | "secondary";
  readonly values: ModalFilterValue[];
  clear(): void;
}

interface ModalSorting {
  readonly id: string;
  readonly name?: string;
  readonly property: unknown;
  readonly directionName?: string;
  isSorted(): boolean;
  enable(): void;
}

const accordion = (
  key: string,
  heading: string,
  expanded: boolean,
  content: () => VNodeChild,
): VNodeChild =>
  h(Accordion, { key, defaultExpanded: expanded }, () => [
    h(Heading, null, () => heading),
    h(Content, null, content),
  ]);

const renderFilterAccordion = (
  filter: ModalFilter,
  expanded: boolean,
  texts: ListTextFormatter,
): VNodeChild => {
  const name = filter.name ?? String(filter.property);
  const activeIds = filter.values.filter((v) => v.isActive).map((v) => v.id);

  const content = (): VNodeChild =>
    filter.mode === "one"
      ? h(Flex, { direction: "column", gap: "m" }, () => [
          h(
            RadioGroup,
            {
              /*
               * Keyed on the selection, like Flow's: the group is controlled
               * and only remounting makes it pick up a value that changed from
               * outside — a chip removed, a reset.
               */
              key: activeIds[0],
              value: activeIds[0],
              m: [1, 1],
              "aria-label": name,
            },
            () =>
              filter.values.map((value) =>
                h(
                  Radio,
                  {
                    key: value.id,
                    value: value.id,
                    onPress: () => {
                      if (!value.isActive) {
                        value.toggle();
                      }
                    },
                  },
                  () => value.render(),
                ),
              ),
          ),
          activeIds.length > 0
            ? h(
                Button,
                {
                  size: "s",
                  color: "secondary",
                  variant: "soft",
                  onPress: () => filter.clear(),
                },
                () => texts("filters.clearSelection"),
              )
            : null,
        ])
      : h(
          CheckboxGroup,
          { value: activeIds, m: [1, 1], "aria-label": name },
          () =>
            filter.values.map((value) =>
              h(
                Checkbox,
                {
                  key: value.id,
                  value: value.id,
                  onPress: () => value.toggle(),
                },
                () => value.render(),
              ),
            ),
        );

  return accordion(`filter-${name}`, name, expanded, content);
};

const renderSortingAccordion = (
  sortings: ModalSorting[],
  expanded: boolean,
  texts: ListTextFormatter,
): VNodeChild => {
  const active = sortings.find((s) => s.isSorted());

  return accordion("sorting", texts("sorting"), expanded, () =>
    h(RadioGroup, { value: active?.id, m: [1, 1] }, () =>
      sortings.map((sorting) =>
        h(
          Radio,
          {
            key: sorting.id,
            value: sorting.id,
            onPress: () => sorting.enable(),
          },
          () =>
            `${sorting.name ?? String(sorting.property)} ${sorting.directionName ?? ""}`.trim(),
        ),
      ),
    ),
  );
};

const renderViewModeAccordion = (
  list: AnyListModel,
  modes: ("list" | "table" | "tiles")[],
  selected: "list" | "table" | "tiles",
  expanded: boolean,
  texts: ListTextFormatter,
): VNodeChild =>
  accordion("viewMode", texts("settings.viewMode"), expanded, () =>
    h(RadioGroup, { value: selected, m: [1, 1] }, () =>
      modes.map((mode) =>
        h(
          Radio,
          { key: mode, value: mode, onPress: () => list.viewMode.set(mode) },
          () => texts(`settings.viewMode.${mode}`),
        ),
      ),
    ),
  );

/**
 * Every filter, sorting and view mode in one off-canvas modal.
 *
 * The mobile path to what the header shows as separate menus on desktop — and
 * on desktop too, where a list has secondary filters that the header leaves
 * out. It drives the same model objects, so a value ticked here is the same
 * event as one ticked in a menu.
 */
export const AllFiltersModal = defineComponent({
  name: "ListAllFiltersModal",

  props: {
    isDisabled: { type: Boolean, default: false },
    /** The layouts this list can show, from the header. */
    viewModes: {
      type: Array as () => ("list" | "table" | "tiles")[],
      default: () => [],
    },
  },

  setup(props) {
    const list = injectListModel();
    const texts = useListTexts();
    const controller = createOverlayController();

    const isInitiallyLoading = watchMobxValue(
      () => list.loaderState.isInitiallyLoading,
    );
    const viewMode = watchMobxValue(() => list.viewMode.value);
    const totalItemCount = watchMobxValue(() => {
      void list.listTable.revision;
      return list.batches.getTotalItemsCount();
    });
    /* Every value below is read off the table's filter and sorting state. */
    const tableRevision = watchMobxValue(() => list.listTable.revision);

    return () => {
      void tableRevision.value;

      const format = texts.value;
      const filters = list.filters as unknown as ModalFilter[];
      const sortings = list.visibleSorting as unknown as ModalSorting[];
      const modes = props.viewModes;

      const accordionCount =
        (modes.length > 1 ? 1 : 0) +
        (sortings.length > 0 ? 1 : 0) +
        filters.length;

      if (accordionCount === 0) {
        return null;
      }

      /* Two or fewer open by default — more than that is a wall of controls. */
      const expanded = accordionCount <= 2;

      const accordions: VNodeChild[] = [
        modes.length > 1
          ? renderViewModeAccordion(
              list,
              modes,
              viewMode.value,
              expanded,
              format,
            )
          : null,
        sortings.length > 0
          ? renderSortingAccordion(sortings, expanded, format)
          : null,
        ...filters.map((filter) =>
          renderFilterAccordion(filter, expanded, format),
        ),
      ];

      const hasSecondaryFilters = filters.some(
        (filter) => filter.priority === "secondary",
      );

      const showCount = format(
        totalItemCount.value === 1 ? "results.show.one" : "results.show.other",
        { totalItemCount: totalItemCount.value },
      );

      return h(ModalTrigger, { controller }, () => [
        h(
          Button,
          {
            class: [
              listStyles.hideOnMobile,
              hasSecondaryFilters ? undefined : listStyles.hideOnDesktop,
            ]
              .filter(Boolean)
              .join(" "),
            variant: "outline",
            color: "secondary",
            isDisabled: props.isDisabled,
          },
          () => [h(Text, null, () => format("filters.all")), h(IconFilter)],
        ),

        h(
          Button,
          {
            class: listStyles.hideOnDesktop,
            variant: "outline",
            color: "secondary",
            "aria-label": format("filters.all"),
          },
          () => h(IconFilter),
        ),

        h(Modal, { offCanvas: true, controller }, () => [
          h(Heading, null, () => format("filters.all")),
          h(Content, null, () => h(Section, null, () => accordions)),
          h(ActionGroup, null, () => [
            h(Button, { onPress: () => controller.close() }, () =>
              h(Text, null, () =>
                isInitiallyLoading.value
                  ? h(SkeletonText, { width: "16ch" })
                  : showCount,
              ),
            ),
            h(
              Button,
              {
                color: "secondary",
                variant: "soft",
                onPress: () => {
                  list.resetFilters();
                  controller.close();
                },
              },
              () => format("reset"),
            ),
          ]),
        ]),
      ]);
    };
  },
});

export default AllFiltersModal;
