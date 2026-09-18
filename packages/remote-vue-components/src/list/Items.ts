import {
  Div,
  ItemsGridList,
  ItemsGridListItem,
  Skeleton,
} from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import { defineComponent, h, type VNodeChild } from "vue";
import { injectListModel } from "./listContext";
import { className, listStyles } from "./styles";

/**
 * The list's items, as a grid list.
 *
 * The same element Flow's React list renders (`flr-items-grid-list`), so the
 * host materialises the same component — layout, selection and keyboard
 * behaviour included. What is rebuilt here is only which items go into it.
 */
export const Items = defineComponent({
  name: "ListItems",

  setup() {
    const list = injectListModel();

    const items = watchMobxValue(() => list.renderedItems);
    const isLoading = watchMobxValue(() => list.loaderState.isLoading);
    const isInitiallyLoading = watchMobxValue(
      () => list.loaderState.isInitiallyLoading,
    );
    const isLoadingMore = watchMobxValue(() => list.loaderState.isLoadingMore);
    const isTiles = watchMobxValue(() => list.viewMode.isTiles);

    /* Placeholders in the item's shape while the first batch is on its way. */
    const renderSkeletons = (): VNodeChild[] =>
      Array.from({ length: list.loadingItemsCount }, (_unused, index) =>
        h(ItemsGridListItem, { key: `skeleton-${index}`, textValue: "-" }, () =>
          h(Skeleton, { width: "100%" }),
        ),
      );

    const renderItems = (): VNodeChild[] => {
      const itemView = list.shape.itemView;

      return items.value.map((item) =>
        h(
          ItemsGridListItem,
          {
            key: item.id,
            id: item.id,
            textValue: itemView?.textValue?.(item.data),
            href: itemView?.href?.(item.data),
            hasAction: !!list.shape.onAction || !!itemView?.href,
            isTile: isTiles.value,
            onAction: list.shape.onAction
              ? () => list.shape.onAction?.(item.data)
              : undefined,
          },
          () => itemView?.render?.(item.data),
        ),
      );
    };

    return () => {
      if (!list.shape.itemView) {
        return null;
      }

      const showLoadingState =
        isLoading.value && !(list.infiniteScroll && isLoadingMore.value);

      return h(
        Div,
        {
          "aria-hidden": isInitiallyLoading.value,
          "aria-busy": isLoading.value,
        },
        () =>
          h(
            ItemsGridList,
            {
              class: className(
                listStyles.items,
                showLoadingState && listStyles.itemsLoading,
                isTiles.value && listStyles.itemsTiles,
              ),
              "aria-label": list.shape["aria-label"],
              "aria-labelledby": list.shape["aria-label"]
                ? undefined
                : list.shape["aria-labelledby"],
              layout: isTiles.value ? "grid" : "stack",
              tileMaxWidth: list.shape.itemView?.tileMaxWidth,
            },
            () =>
              items.value.length === 0 && isInitiallyLoading.value
                ? renderSkeletons()
                : renderItems(),
          ),
      );
    };
  },
});

export default Items;
