import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Div,
  MenuItem,
  SearchField,
  Text,
} from "@/auto-generated";
import {
  IconAscending,
  IconDescending,
  IconFilter,
  IconSorting,
} from "@/icons";
import { watchMobxValue } from "@/lib/mobxSelector";
import { defineComponent, h, ref, watch, type VNodeChild } from "vue";
import { injectListModel, type AnyListModel } from "./listContext";
import { useListTexts, type ListTextFormatter } from "./locales";
import { listStyles } from "./styles";
import type { ListRendered } from "./types";

const autoSubmitTimeout = 500;

/*
 * What the header needs of a sorting and of a filter, and nothing more.
 *
 * Not the classes themselves: a list of concrete filters is not assignable to
 * a list of generic ones, because a row model sits in a contravariant position
 * deep inside `Column`, so `Table<any>` and `Table<never>` never meet. Reading
 * only the members it renders keeps the header out of that entirely.
 */
interface HeaderSorting {
  readonly id: string;
  readonly name?: string;
  readonly property: unknown;
  readonly direction: "asc" | "desc";
  readonly directionName?: string;
  isSorted(): boolean;
  enable(): void;
}

interface HeaderFilterValue {
  readonly id: string;
  readonly isActive: boolean;
  toggle(): void;
  render(): ListRendered;
}

interface HeaderFilter {
  readonly storageKey: string;
  readonly mode: string;
  readonly name?: string;
  readonly property: unknown;
  readonly values: HeaderFilterValue[];
}

/** Which layouts this list can actually show. */
type ViewMode = "list" | "table" | "tiles";

const availableViewModes = (list: AnyListModel): ViewMode[] => {
  const modes: ViewMode[] = [];
  if (list.shape.itemView?.showList) {
    modes.push("list");
  }
  if (list.shape.table) {
    modes.push("table");
  }
  if (list.shape.itemView?.showTiles) {
    modes.push("tiles");
  }
  return modes;
};

const outlineButton = (isDisabled: boolean) => ({
  variant: "outline" as const,
  color: "secondary" as const,
  class: listStyles.hideOnMobile,
  isDisabled,
});

const renderViewModeMenu = (
  list: AnyListModel,
  texts: ListTextFormatter,
  isDisabled: boolean,
  selected: ViewMode,
): VNodeChild => {
  const modes = availableViewModes(list);

  if (modes.length <= 1) {
    return null;
  }

  return h(ContextMenuTrigger, null, () => [
    h(
      Button,
      { ...outlineButton(isDisabled), "aria-label": texts("settings") },
      () => h(Text, null, () => texts(`settings.viewMode.${selected}`)),
    ),
    h(ContextMenu, { selectionMode: "single", selectedKeys: [selected] }, () =>
      modes.map((mode) =>
        h(
          MenuItem,
          { key: mode, id: mode, onAction: () => list.viewMode.set(mode) },
          () => texts(`settings.viewMode.${mode}`),
        ),
      ),
    ),
  ]);
};

const renderSortingMenu = (
  list: AnyListModel,
  texts: ListTextFormatter,
  isDisabled: boolean,
): VNodeChild => {
  const sortings = list.visibleSorting as HeaderSorting[];

  if (sortings.length === 0) {
    return null;
  }

  const active = sortings.find((s) => s.isSorted());

  return h(ContextMenuTrigger, null, () => [
    h(Button, outlineButton(isDisabled), () => [
      h(Text, null, () =>
        active ? (active.name ?? String(active.property)) : texts("sorting"),
      ),
      h(
        active
          ? active.direction === "asc"
            ? IconAscending
            : IconDescending
          : IconSorting,
      ),
    ]),
    h(
      ContextMenu,
      {
        selectionMode: "single",
        selectedKeys: active ? [active.id] : [],
      },
      () =>
        sortings.map((sorting) =>
          h(
            MenuItem,
            {
              key: sorting.id,
              id: sorting.id,
              onAction: () => sorting.enable(),
            },
            () =>
              `${sorting.name ?? String(sorting.property)} ${sorting.directionName ?? ""}`.trim(),
          ),
        ),
    ),
  ]);
};

const renderFilterMenu = (
  filter: HeaderFilter,
  isDisabled: boolean,
): VNodeChild => {
  const selectionMode = filter.mode === "one" ? "single" : "multiple";
  const values = filter.values;

  return h(ContextMenuTrigger, { key: filter.storageKey }, () => [
    h(Button, outlineButton(isDisabled), () => [
      h(Text, null, () => filter.name ?? String(filter.property)),
      h(IconFilter),
    ]),
    h(
      ContextMenu,
      {
        selectionMode,
        selectedKeys: values.filter((v) => v.isActive).map((v) => v.id),
      },
      () =>
        values.map((value) =>
          h(
            MenuItem,
            {
              key: value.id,
              id: value.id,
              onAction: () => {
                if (selectionMode === "multiple" || !value.isActive) {
                  value.toggle();
                }
              },
            },
            () => value.render(),
          ),
        ),
    ),
  ]);
};

/**
 * The list's controls: layout, sorting, filters, search.
 *
 * Each one is a remote element the host materialises — a context menu trigger
 * with a button and a menu — and what they act on is the shared model, so a
 * filter behaves here exactly as it does in React.
 */
export const Header = defineComponent({
  name: "ListHeader",

  setup() {
    const list = injectListModel();
    const texts = useListTexts();

    const isEmpty = watchMobxValue(() => list.isEmpty);
    const isInitiallyLoading = watchMobxValue(
      () => list.loaderState.isInitiallyLoading,
    );
    const emptyViewType = watchMobxValue(() => list.getEmptyViewType());
    const viewMode = watchMobxValue(() => list.viewMode.value);
    /* Filters and sortings read the table, so they follow its revision. */
    const tableRevision = watchMobxValue(() => list.listTable.revision);

    const searchInput = ref(list.search?.value ?? "");
    let submitTimeout: ReturnType<typeof setTimeout> | undefined;

    watch(searchInput, (value) => {
      clearTimeout(submitTimeout);
      submitTimeout = setTimeout(
        () => list.search?.setValue(value === "" ? undefined : value),
        autoSubmitTimeout,
      );
    });

    return () => {
      void tableRevision.value;

      const noItemsAvailable = isEmpty.value && emptyViewType.value === "list";
      const isDisabled = isInitiallyLoading.value || noItemsAvailable;

      const options: VNodeChild[] = [
        renderViewModeMenu(list, texts.value, isDisabled, viewMode.value),
        renderSortingMenu(list, texts.value, isDisabled),
        ...(list.filters as HeaderFilter[]).map((filter) =>
          renderFilterMenu(filter, isDisabled),
        ),
        list.search
          ? h(SearchField, {
              isDisabled,
              value: searchInput.value,
              onChange: (value: string) => {
                searchInput.value = value;
              },
              onClear: () => {
                searchInput.value = "";
              },
            })
          : null,
      ];

      if (options.every((option) => option === null)) {
        return null;
      }

      return h(
        Div,
        {
          class: [
            listStyles.header,
            list.search ? listStyles.headerWithSearch : undefined,
          ]
            .filter(Boolean)
            .join(" "),
        },
        () =>
          h(Div, { class: listStyles.headerContent }, () =>
            h(Div, { class: listStyles.headerOptions }, () => options),
          ),
      );
    };
  },
});

export default Header;
