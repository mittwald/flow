import { Div, ListEmptyViewContainer } from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import type { AnyRecord } from "@/lib/types";
import {
  computed,
  defineComponent,
  h,
  onMounted,
  watch,
  type PropType,
  type VNodeChild,
} from "vue";
import { ListComposableBatchLoader } from "./ComposableLoader";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Items } from "./Items";
import { ListTableView } from "./Table";
import { provideListModel } from "./listContext";
import { ListModel } from "./model";
import { useListSettings } from "./settings";
import {
  findSetup,
  findSetups,
  ListFilter,
  ListItem,
  ListLoaderAsync,
  ListLoaderComposable,
  ListSearch,
  ListSorting,
  ListStaticData,
  ListTable,
  ListTableBody,
  ListTableCell,
  ListTableColumn,
  ListTableHeader,
  ListTableRow,
} from "./setupComponents";
import { className, listStyles } from "./styles";
import type { VueListShape } from "./types";
import { composition } from "@/lib/composition";
import { useComponentUsage } from "@/composables/useComponentUsage";

/**
 * Reads the list's configuration off the elements inside it.
 *
 * The same shape Flow's React list takes, assembled the same way: the children
 * are the API, so `<ListFilter>` and `<ListSorting>` describe the list rather
 * than rendering anything.
 */
const readShape = (
  children: unknown,
  props: AnyRecord,
): VueListShape<never> => {
  const staticData = findSetup(children, ListStaticData);
  const asyncLoader = findSetup(children, ListLoaderAsync);
  const composableLoader = findSetup(children, ListLoaderComposable);
  /* The flags belong to whichever dynamic source is there; a list has one. */
  const dynamicLoader = asyncLoader ?? composableLoader;
  const item = findSetup(children, ListItem);
  const search = findSetup(children, ListSearch);
  const columns = findSetups(children, ListTableColumn);

  /*
   * React nests its table elements and finds them with a deep walk; the walk
   * here stops at a component on purpose, so the columns and cells are direct
   * children of the `List`. Nesting them the React way is otherwise silent —
   * a table view with no columns, which renders as no table view at all.
   */
  if (columns.length === 0 && findSetup(children, ListTable)) {
    throw new Error(
      "<ListTable> was given no columns. Write <ListTableColumn> and " +
        "<ListTableCell> as direct children of <List>, not inside " +
        "<ListTable> — the list reads its own children and does not walk " +
        "into them.",
    );
  }

  return {
    staticData: staticData?.props.data as never[] | undefined,
    /*
     * A prop, not a scoped slot: Vue normalizes a slot's return into vnodes, so
     * a loader written as a slot would hand back a rendered nothing instead of
     * its promise.
     */
    asyncLoader: asyncLoader?.props.loader as never,
    dependencies: asyncLoader?.props.dependencies as unknown[] | undefined,
    /*
     * Also a prop, and for a second reason: a composable has to run in the
     * `setup()` of the component that renders it, and a slot's function is
     * called during render.
     */
    composableLoader: composableLoader?.props.loader as never,
    manualPagination: dynamicLoader?.props.manualPagination as
      boolean | undefined,
    manualFiltering: dynamicLoader?.props.manualFiltering as
      boolean | undefined,
    manualSorting: dynamicLoader?.props.manualSorting as boolean | undefined,

    filters: findSetups(children, ListFilter).map((f) => f.props) as never,
    sorting: findSetups(children, ListSorting).map((s) => s.props) as never,
    search: search ? (search.props as never) : undefined,

    itemView: item
      ? {
          render: item.render
            ? (data: never) => item.render?.({ data }) as VNodeChild
            : undefined,
          textValue: item.props.textValue as
            ((data: never) => string) | undefined,
          href: item.props.href as ((data: never) => string) | undefined,
          target: item.props.target as string | undefined,
          defaultExpanded: item.props.defaultExpanded as
            ((data: never) => boolean) | undefined,
          showList: (item.props.showList as boolean | undefined) ?? true,
          showTiles: item.props.showTiles as boolean | undefined,
          /* Flow's default, and it reaches the host as a grid template. */
          tileMaxWidth: (item.props.tileMaxWidth as number | undefined) ?? 230,
        }
      : undefined,

    settings: props.settings as never,
    table:
      columns.length > 0
        ? {
            props: findSetup(children, ListTable)?.props ?? {},
            headerProps: findSetup(children, ListTableHeader)?.props ?? {},
            bodyProps: findSetup(children, ListTableBody)?.props ?? {},
            rowProps: findSetup(children, ListTableRow)?.props ?? {},
            columns: columns.map((column) => ({
              props: column.props,
              render: column.render
                ? () => column.render?.({}) as VNodeChild
                : undefined,
            })),
            cells: findSetups(children, ListTableCell).map((cell) => ({
              props: cell.props,
              render: cell.render
                ? (data: never) => cell.render?.({ data }) as VNodeChild
                : undefined,
            })),
          }
        : undefined,

    componentProps: {
      selectionMode: props.selectionMode as never,
      selectionBehavior: props.selectionBehavior as never,
      selectedKeys: props.selectedKeys as never,
      defaultSelectedKeys: props.defaultSelectedKeys as never,
      disabledKeys: props.disabledKeys as never,
      disallowEmptySelection: props.disallowEmptySelection as never,
      onSelectionChange: props.onSelectionChange as never,
    },

    accordion: props.accordion as boolean | undefined,
    batchSize: props.batchSize as number | undefined,
    loadingItemsCount: props.loadingItemsCount as number | undefined,
    getItemId: props.getItemId as ((data: never) => string) | undefined,
    defaultViewMode: props.defaultViewMode as never,
    onAction: props.onAction as ((data: never) => void) | undefined,
    "aria-label": props["aria-label"] as string | undefined,
    "aria-labelledby": props["aria-labelledby"] as string | undefined,
  };
};

/**
 * Flow's `List`, rebuilt in Vue.
 *
 * `List` is a React composition rather than a remote element, so there is
 * nothing to generate — but everything it _decides_ now lives in
 * `@mittwald/flow-components-base` and is shared with React. What is written
 * here is the arrangement: which remote elements the host is asked for, and the
 * one job the shared model leaves open, which is fetching a batch.
 */
export const List = defineComponent({
  name: "List",

  props: {
    /**
     * The key the list's view settings are persisted under. Needs a surrounding
     * `<SettingsProvider>`; without a key nothing is persisted.
     */
    settingStorageKey: { type: String, default: undefined },
    /**
     * Whether items can be selected, and how many.
     *
     * The host's grid list and table own the selection — these are handed
     * straight through, the way Flow's React list hands them through.
     */
    selectionMode: {
      type: String as PropType<"none" | "single" | "multiple">,
      default: undefined,
    },
    /** Whether selecting replaces the selection or adds to it. */
    selectionBehavior: {
      type: String as PropType<"toggle" | "replace">,
      default: undefined,
    },
    selectedKeys: {
      type: [Array, String] as PropType<"all" | readonly (string | number)[]>,
      default: undefined,
    },
    defaultSelectedKeys: {
      type: [Array, String] as PropType<"all" | readonly (string | number)[]>,
      default: undefined,
    },
    disabledKeys: {
      type: Array as PropType<readonly (string | number)[]>,
      default: undefined,
    },
    disallowEmptySelection: { type: Boolean, default: undefined },
    onSelectionChange: {
      type: Function as PropType<(keys: unknown) => void>,
      default: undefined,
    },

    /**
     * Makes the items expandable. The expanded content is the item's `<Content
     * slot="bottom">`.
     */
    accordion: { type: Boolean, default: false },
    /** How many items one batch holds. @default 20 */
    batchSize: { type: Number, default: undefined },
    /** How many placeholders to show while the first batch loads. */
    loadingItemsCount: { type: Number, default: undefined },
    /** A stable id per item, used to deduplicate across batches. */
    getItemId: {
      type: Function as PropType<(data: never) => string>,
      default: undefined,
    },
    /** The layout to start in. @default "list" */
    defaultViewMode: {
      type: String as PropType<"list" | "table" | "tiles">,
      default: undefined,
    },
    /** Hides the pagination controls below the list. */
    hidePagination: { type: Boolean, default: false },
    onAction: {
      type: Function as PropType<(data: never) => void>,
      default: undefined,
    },
  },

  setup(props, { slots, attrs }) {
    /* Flow's React `List` is a `flowComponent` and reports itself. */
    onMounted(useComponentUsage("List"));

    const settings = useListSettings(props.settingStorageKey);
    const list = new ListModel<never>(
      readShape(slots.default?.(), { ...props, ...attrs, settings }),
    );
    provideListModel(list);

    /*
     * The loader, which is the half `components-base` deliberately does not
     * have. Everything it reacts to is MobX — how far the list has paged, and
     * which batches are still unaccounted for — so one watcher covers paging,
     * a changed filter and a changed search alike.
     */
    const loadState = watchMobxValue(() => {
      void list.listTable.revision;
      return {
        batchIndex: list.batches.getBatchIndex(),
        knownBatches: list.loaderState.batchLoadingStates.length,
      };
    });

    /*
     * Returns the loads, so a failed one reaches Vue's error handling: a watch
     * callback's rejected promise goes to `onErrorCaptured` and the app's
     * `errorHandler`, and `RemoteRoot` reports it to the host.
     */
    watch(
      loadState,
      () => {
        const loads: Promise<void>[] = [];

        for (let index = 0; index <= loadState.value.batchIndex; index++) {
          /*
           * `"void"` is a batch nobody has asked for yet — the state a fresh
           * loader starts in — and a missing entry is a batch a reset dropped.
           * Both need loading; only `"loading"` means someone already is.
           */
          const state = list.loaderState.batchLoadingStates[index];
          if (state !== undefined && state !== "void") {
            continue;
          }
          list.loaderState.setBatchLoadingState(index, "loading");

          /*
           * A composable loader reports from its own component instead — the
           * state above is what makes the list render a skeleton until it
           * does.
           */
          if (!list.hasComposableLoader) {
            loads.push(list.loadBatch(index));
          }
        }

        return Promise.all(loads);
      },
      { immediate: true },
    );

    /*
     * A stored selection can name a value the data no longer has. Dropping it
     * is not cosmetic: kept, it filters everything away and leaves no control
     * to take it back.
     */
    onMounted(() =>
      list.filters.forEach((filter) => filter.deleteUnknownFilterValues()),
    );

    const data = watchMobxValue(() => list.loaderState.mergedData);
    watch(data, (value) => list.setData(value), { immediate: true });

    const isEmpty = watchMobxValue(() => list.isEmpty);
    const emptyViewType = watchMobxValue(() => list.getEmptyViewType());
    const hasItems = watchMobxValue(() => list.renderedItems.length > 0);
    const isTable = watchMobxValue(() => list.viewMode.isTable);

    /* One component per batch the list has asked for. Empty for every other source. */
    const composableBatches = computed(() =>
      list.hasComposableLoader
        ? Array.from(
            { length: loadState.value.batchIndex + 1 },
            (ignored, index) => index,
          )
        : [],
    );

    return () => {
      const children = slots.default?.();
      const shape = readShape(children, { ...props, ...attrs });

      /* The children are the API, so a changed child has to reach the model. */
      list.shape.itemView = shape.itemView;
      list.shape.onAction = shape.onAction;
      list.shape.componentProps = shape.componentProps;
      list.shape.accordion = shape.accordion;
      list.shape.table = shape.table;
      list.updateSetup(shape);
      /*
       * Compared item by item, which also makes this render depend on every
       * index of a reactive array — so one changed in place re-renders the
       * list and arrives here.
       */
      if (shape.staticData) {
        list.setStaticData(shape.staticData);
      }

      /*
       * Always rendered, even when there are items: taking it out of the tree
       * and putting it back loses whatever state its content holds — the same
       * reason Flow's React list hides it rather than dropping it.
       */
      const emptyView = h(
        Div,
        {
          "aria-hidden": !isEmpty.value,
          class: isEmpty.value ? undefined : listStyles.hideVisuallyEmptyView,
        },
        () =>
          h(
            ListEmptyViewContainer,
            { viewType: emptyViewType.value },
            {
              emptySearchResultView: slots.emptySearchResultView,
              emptyView: slots.emptyView,
            },
          ),
      );

      return h(
        Div,
        {
          class: className(listStyles.list, attrs.class as string | undefined),
        },
        () => [
          ...composableBatches.value.map((index) =>
            h(ListComposableBatchLoader, { key: index, batchIndex: index }),
          ),
          h(Header),
          h(Div, { class: listStyles.listWrapper }, () => [
            emptyView,
            hasItems.value && slots.summary ? slots.summary() : null,
            isTable.value ? h(ListTableView) : h(Items),
          ]),
          props.hidePagination ? null : h(Footer),
        ],
      );
    };
  },
});

composition(List);

export default List;
