import { Div, ListEmptyViewContainer } from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import type { AnyRecord } from "@/lib/types";
import { defineComponent, h, watch, type PropType, type VNodeChild } from "vue";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Items } from "./Items";
import { provideListModel } from "./listContext";
import { ListModel } from "./model";
import {
  findSetup,
  findSetups,
  ListFilter,
  ListItem,
  ListLoaderAsync,
  ListSearch,
  ListSorting,
  ListStaticData,
} from "./setupComponents";
import { className, listStyles } from "./styles";
import type { VueListShape } from "./types";

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
  const item = findSetup(children, ListItem);
  const search = findSetup(children, ListSearch);

  return {
    staticData: staticData?.props.data as never[] | undefined,
    /*
     * A prop, not a scoped slot: Vue normalizes a slot's return into vnodes, so
     * a loader written as a slot would hand back a rendered nothing instead of
     * its promise.
     */
    asyncLoader: asyncLoader?.props.loader as never,
    manualPagination: asyncLoader?.props.manualPagination as
      boolean | undefined,
    manualFiltering: asyncLoader?.props.manualFiltering as boolean | undefined,
    manualSorting: asyncLoader?.props.manualSorting as boolean | undefined,

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
          showList: (item.props.showList as boolean | undefined) ?? true,
          showTiles: item.props.showTiles as boolean | undefined,
          tileMaxWidth: item.props.tileMaxWidth as number | undefined,
        }
      : undefined,

    batchSize: props.batchSize as number | undefined,
    loadingItemsCount: props.loadingItemsCount as number | undefined,
    getItemId: props.getItemId as ((data: never) => string) | undefined,
    defaultViewMode: props.defaultViewMode as never,
    infiniteScroll: props.infiniteScroll as boolean | undefined,
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
    /** Loads the next batch on scroll instead of showing a button. */
    infiniteScroll: { type: Boolean, default: false },
    /** Hides the pagination controls below the list. */
    hidePagination: { type: Boolean, default: false },
    onAction: {
      type: Function as PropType<(data: never) => void>,
      default: undefined,
    },
  },

  setup(props, { slots, attrs }) {
    const list = new ListModel<never>(
      readShape(slots.default?.(), { ...props, ...attrs }),
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

    watch(
      loadState,
      () => {
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
          void list.loadBatch(index);
        }
      },
      { immediate: true },
    );

    const data = watchMobxValue(() => list.loaderState.mergedData);
    watch(data, (value) => list.setData(value), { immediate: true });

    const isEmpty = watchMobxValue(() => list.isEmpty);
    const emptyViewType = watchMobxValue(() => list.getEmptyViewType());
    const hasItems = watchMobxValue(() => list.renderedItems.length > 0);
    const isTable = watchMobxValue(() => list.viewMode.isTable);

    return () => {
      const children = slots.default?.();
      const shape = readShape(children, { ...props, ...attrs });

      /* The children are the API, so a changed child has to reach the model. */
      list.shape.itemView = shape.itemView;
      list.shape.onAction = shape.onAction;
      if (shape.staticData && shape.staticData !== list.shape.staticData) {
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
          h(Header),
          h(Div, { class: listStyles.listWrapper }, () => [
            emptyView,
            hasItems.value && slots.summary ? slots.summary() : null,
            isTable.value ? null : h(Items),
          ]),
          props.hidePagination ? null : h(Footer),
        ],
      );
    };
  },
});

export default List;
