import {
  Avatar,
  Div,
  Heading,
  ItemsGridList,
  ItemsGridListItem,
  ListItemViewContent,
  Skeleton,
  SkeletonText,
  Text,
} from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import { defineComponent, h, type VNodeChild } from "vue";
import { ListItemRow } from "./Item";
import { injectListModel } from "./listContext";
import { className, listStyles } from "./styles";
import { composition } from "@/lib/composition";

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
    const isTiles = watchMobxValue(() => list.viewMode.isTiles);
    const viewMode = watchMobxValue(() => list.viewMode.value);

    /*
     * Placeholders in the item's shape while the first batch is on its way —
     * the same shape Flow's `ListItemSkeletonView` builds: a title and a
     * subtitle, plus the avatar the tile view has room for. A single bar
     * instead is a different loading state, which is what the demo shows
     * side by side.
     */
    const renderSkeletons = (): VNodeChild[] =>
      Array.from({ length: list.loadingItemsCount }, (_unused, index) =>
        h(
          ItemsGridListItem,
          {
            key: `skeleton-${index}`,
            textValue: "-",
            isTile: isTiles.value,
          },
          () =>
            h(
              ListItemViewContent,
              { viewMode: viewMode.value },
              {
                title: () =>
                  h(Heading, null, () => h(SkeletonText, { width: "200px" })),
                /*
                 * No aspect ratio: Flow's `ListItemSkeletonView` sets it as a
                 * `style`, which the host drops for a remote list.
                 */
                ...(isTiles.value
                  ? { avatar: () => h(Avatar, null, () => h(Skeleton)) }
                  : {}),
                subTitle: () =>
                  h(Text, null, () => h(SkeletonText, { width: "300px" })),
              },
            ),
        ),
      );

    const renderItems = (): VNodeChild[] =>
      items.value.map((item) =>
        h(ListItemRow, {
          key: item.id,
          itemId: item.id,
          data: item.data,
          isTile: isTiles.value,
        }),
      );

    return () => {
      if (!list.shape.itemView) {
        return null;
      }

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
              ...list.shape.componentProps,
              class: className(
                listStyles.items,
                isLoading.value && listStyles.itemsLoading,
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

composition(Items);

export default Items;
