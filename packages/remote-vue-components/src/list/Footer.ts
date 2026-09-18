import { Button, Div, LoadingSpinner, Skeleton, Text } from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import { defineComponent, h, type VNodeChild } from "vue";
import { injectListModel } from "./listContext";
import { useListTexts } from "./locales";
import { listStyles } from "./styles";

/** How many items are shown, and the way to ask for more. */
export const Footer = defineComponent({
  name: "ListFooter",

  setup() {
    const list = injectListModel();
    const texts = useListTexts();

    const isLoading = watchMobxValue(() => list.loaderState.isLoading);
    const isInitiallyLoading = watchMobxValue(
      () => list.loaderState.isInitiallyLoading,
    );
    const isEmpty = watchMobxValue(() => list.isEmpty);
    const counts = watchMobxValue(() => {
      void list.listTable.revision;
      return {
        total: list.batches.getTotalItemsCount(),
        visible: list.batches.getVisibleItemsCount(),
        hasNextBatch: list.batches.hasNextBatch(),
      };
    });

    const renderPaginationInfo = (): VNodeChild => {
      if (isEmpty.value) {
        return null;
      }

      const showSkeleton =
        isLoading.value && (!list.infiniteScroll || isInitiallyLoading.value);

      return h(Text, null, () =>
        showSkeleton
          ? h(Skeleton, { width: "200px" })
          : texts.value("paginationInfo", {
              visibleItemsCount: counts.value.visible,
              totalItemsCount: counts.value.total,
            }),
      );
    };

    const renderShowNextBatch = (): VNodeChild => {
      if (!counts.value.hasNextBatch && !isLoading.value) {
        return null;
      }

      return h(
        Button,
        {
          isPending: isLoading.value && !isInitiallyLoading.value,
          isDisabled: isInitiallyLoading.value,
          variant: "plain",
          size: "s",
          onPress: () => list.batches.nextBatch(),
        },
        () => texts.value("showMore"),
      );
    };

    return () =>
      h(Div, { class: listStyles.footer }, () => [
        renderPaginationInfo(),
        list.infiniteScroll ? null : renderShowNextBatch(),
        list.infiniteScroll && isLoading.value && !isInitiallyLoading.value
          ? h(LoadingSpinner, { "aria-label": texts.value("loadingMore") })
          : null,
      ]);
  },
});

export default Footer;
