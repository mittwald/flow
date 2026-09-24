import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Div,
  MenuItem,
  RangeCalendar,
  SearchField,
  Text,
} from "@/auto-generated";
import { Popover } from "@/overlays/Popover";
import { PopoverTrigger } from "@/overlays/triggers";
import {
  IconAscending,
  IconDescending,
  IconFilter,
  IconSorting,
  IconView,
} from "@/icons";
import { watchMobxValue } from "@/lib/mobxSelector";
import {
  createOverlayController,
  type OverlayController,
} from "@/overlays/overlayController";
import {
  defineComponent,
  h,
  onBeforeUnmount,
  ref,
  watch,
  type VNodeChild,
} from "vue";
import { ActiveFilters } from "./ActiveFilters";
import { AllFiltersModal } from "./AllFiltersModal";
import { isDateRangeFilter } from "./dateRangeFilter";
import { injectListModel, type AnyListModel } from "./listContext";
import { useListTexts, type ListTextFormatter } from "./locales";
import { listStyles } from "./styles";
import type { ListRendered } from "./types";
import { composition } from "@/lib/composition";

const autoSubmitTimeout = 500;

/* `FilterContextMenus.module.scss`'s `.calendar`. */
const dateRangeCalendarClass =
  "flow--list--header--filter-context-menu--calendar";

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

interface HeaderDateRangeFilter {
  readonly storageKey: string;
  readonly name?: string;
  readonly property: unknown;
  readonly dateRangeOptions?: Record<string, unknown>;
  getValue(): unknown;
  setValue(range: unknown): void;
}

interface HeaderFilter {
  readonly storageKey: string;
  readonly mode: string;
  readonly priority: "primary" | "secondary";
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
      () => [
        h(Text, null, () => texts(`settings.viewMode.${selected}`)),
        h(IconView),
      ],
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

/**
 * A date-range filter is a calendar in a popover, not a menu of values.
 *
 * The same shape Flow's React list gives it — the calendar closes the popover
 * when a range is picked, because a range is complete the moment its second end
 * is.
 */
const renderDateRangeFilter = (
  filter: HeaderDateRangeFilter,
  isDisabled: boolean,
  calendarLabel: string,
  controller: OverlayController,
): VNodeChild =>
  h(PopoverTrigger, { key: filter.storageKey, controller }, () => [
    h(Button, outlineButton(isDisabled), () => [
      h(Text, null, () => filter.name ?? String(filter.property)),
      h(IconFilter),
    ]),
    h(
      Popover,
      {
        placement: "bottom end",
        isDialogContent: true,
        "aria-label": calendarLabel,
      },
      () =>
        /*
         * Cast at the call, because the options are whatever the consumer
         * handed the filter: an open record does not match a typed component's
         * props, and TypeScript then resolves `h` to its instance overload.
         */
        h(RangeCalendar, {
          ...filter.dateRangeOptions,
          class: dateRangeCalendarClass,
          value: filter.getValue(),
          onChange: (range: unknown) => {
            filter.setValue(range);
            controller.close();
          },
        } as never),
    ),
  ]);

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

    /*
     * One controller per date filter, kept for as long as the header is.
     * Created in the render it would be a new one every time — and a range
     * takes two clicks, so the popover would forget the first between them.
     */
    const dateControllers = new Map<string, OverlayController>();
    const dateController = (key: string): OverlayController => {
      const existing = dateControllers.get(key);
      if (existing) {
        return existing;
      }
      const created = createOverlayController();
      dateControllers.set(key, created);
      return created;
    };

    /*
     * Flow's `DefaultSearchFieldRender`: the field holds what is typed, and a
     * search is submitted after a pause — or, with `autoSubmit={false}`, on
     * Enter. Escape and the clear button clear at once.
     */
    const searchShape = list.shape.search;
    const autoSubmit = searchShape?.autoSubmit !== false;
    const searchInput = ref(list.search?.value ?? "");
    let previousSearch = "";
    let submitTimeout: ReturnType<typeof setTimeout> | undefined;

    const submitSearch = () => {
      if (searchInput.value.trim() === "") {
        list.search?.setValue(undefined);
      } else if (previousSearch !== searchInput.value) {
        previousSearch = searchInput.value;
        list.search?.setValue(searchInput.value);
      }
    };

    const clearSearch = () => {
      clearTimeout(submitTimeout);
      list.search?.setValue(undefined);
      searchInput.value = "";
    };

    watch(searchInput, () => {
      clearTimeout(submitTimeout);
      if (autoSubmit) {
        submitTimeout = setTimeout(submitSearch, autoSubmitTimeout);
      }
    });

    /* A search set from outside the field — a reset — shows in it. */
    const searchValue = watchMobxValue(() => {
      void list.listTable.revision;
      return list.search?.value;
    });
    watch(searchValue, (value) => {
      searchInput.value = value ?? "";
    });

    const onSearchKeyUp = (event: { key?: string } | undefined) => {
      if (event?.key === "Enter" && !autoSubmit) {
        submitSearch();
      } else if (event?.key === "Escape") {
        clearSearch();
      }
    };

    onBeforeUnmount(() => clearTimeout(submitTimeout));

    return () => {
      void tableRevision.value;

      const noItemsAvailable = isEmpty.value && emptyViewType.value === "list";
      const isDisabled = isInitiallyLoading.value || noItemsAvailable;
      const modes = availableViewModes(list);

      /*
       * The header is rendered even with nothing in it, because Flow's is: it
       * holds the tunnel exit an app's own `ActionGroup` lands in, and a list
       * that gained one would otherwise change the DOM around it.
       *
       * Asked of the model rather than of what the options rendered — the
       * all-filters modal decides for itself whether it has anything to show.
       */
      const hasOptions =
        list.filters.length > 0 ||
        list.visibleSorting.length > 0 ||
        !!list.search ||
        modes.length > 1;

      /*
       * Nothing to show yet and nothing to configure it with: Flow hides the
       * header rather than dropping it, so what an app put in it keeps its
       * state across the switch to and from the empty view.
       */
      if (noItemsAvailable) {
        return h(
          Div,
          { class: listStyles.hideVisuallyActions, "aria-hidden": true },
          /*
           * Same nesting and same classes as the branch below, which is what
           * Flow's comment on this branch asks for — the tunnel's content has
           * to survive the switch. React arrives at the inner class by reusing
           * the element rather than by setting it: a `className` that goes from
           * set to undefined never reaches the host, so the previous one stays.
           */
          () => h(Div, { class: listStyles.headerContent }),
        );
      }

      const options: VNodeChild[] = [
        renderViewModeMenu(list, texts.value, isDisabled, viewMode.value),
        renderSortingMenu(list, texts.value, isDisabled),
        /*
         * Primary only. A secondary filter is reachable through the
         * all-filters modal, which is the whole reason that modal shows on
         * desktop at all.
         */
        ...(list.filters as HeaderFilter[])
          .filter((filter) => filter.priority === "primary")
          .map((filter) =>
            isDateRangeFilter(filter)
              ? renderDateRangeFilter(
                  filter as unknown as HeaderDateRangeFilter,
                  isDisabled,
                  texts.value("dateRange"),
                  dateController(filter.storageKey),
                )
              : renderFilterMenu(filter, isDisabled),
          ),
        h(AllFiltersModal, { isDisabled, viewModes: modes }),
        list.search
          ? h(SearchField, {
              class: listStyles.searchField,
              isDisabled,
              autoFocus: searchShape?.autoFocus,
              value: searchInput.value,
              onChange: (value: string) => {
                searchInput.value = value;
              },
              onKeyUp: onSearchKeyUp,
              onClear: clearSearch,
            })
          : null,
      ];

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
        () => [
          h(Div, { class: listStyles.headerContent }, () =>
            hasOptions
              ? h(Div, { class: listStyles.headerOptions }, () => options)
              : null,
          ),
          h(ActiveFilters, { isDisabled }),
        ],
      );
    };
  },
});

composition(Header);

export default Header;
