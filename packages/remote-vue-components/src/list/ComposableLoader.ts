import { watchMobxValue } from "@/lib/mobxSelector";
import { isDeepEqual } from "remeda";
import { defineComponent, shallowRef, toValue, watch, watchEffect } from "vue";
import { injectListModel } from "./listContext";
import { composition } from "@/lib/composition";

/**
 * One batch of a composable loader.
 *
 * A composable runs in `setup()` and nowhere else, so the list cannot call one
 * from the watcher that drives its async loader. It renders one of these per
 * batch instead — which is what React's `DataLoader` does with its hooks
 * loader, one component per batch, each calling the consumer's hook.
 *
 * It renders nothing. What it contributes is a `setup()` for the consumer's
 * composable and an effect that reports what the composable produced.
 */
export const ListComposableBatchLoader = defineComponent({
  name: "ListComposableBatchLoader",

  props: {
    batchIndex: { type: Number, required: true },
  },

  setup(props) {
    const list = injectListModel();
    const loader = list.shape.composableLoader;

    /*
     * Captured once: the component is keyed by its batch, so the index never
     * changes for an instance — and nothing below would notice if it did,
     * because a MobX `autorun` does not track a Vue prop.
     */
    const batchIndex = props.batchIndex;

    if (!loader) {
      return () => null;
    }

    /*
     * The query as a getter. The list rebuilds it whenever a filter, the
     * sorting or the search changes, and the consumer decides what that means:
     * a query key reading it refetches, a composable ignoring it does not.
     */
    const query = watchMobxValue(() => {
      /*
       * The search term is table state, and the table's state is only
       * observable through the revision — `getState()` hands back plain data.
       * Without this read a manually filtering source would never see a
       * changed search.
       */
      void list.listTable.revision;
      return list.getDataLoaderOptions(batchIndex);
    });

    /*
     * A new object only when the query changed. The revision also moves when a
     * reported batch reaches the table, and a composable that recomputed on
     * that would hand back a new result, which is reported, which moves the
     * revision again.
     */
    const options = shallowRef(query.value);
    watch(query, (next) => {
      if (!isDeepEqual(next, options.value)) {
        options.value = next;
      }
    });

    const result = loader(() => options.value);

    /*
     * Reported whenever the value changes, like React's `useEffect(…,
     * [loaderResult])`. And again when a reset clears `"loaded"` — a changed
     * filter drops every batch — so a composable that has nothing new to hand
     * back does not leave the list in a skeleton. Its fresh answer, landing
     * after that, is a new value and reported too.
     */
    const isUnreported = watchMobxValue(
      () => list.loaderState.batchLoadingStates[batchIndex] !== "loaded",
    );
    let reported: unknown;

    watchEffect(() => {
      const value = toValue(result);
      const unreported = isUnreported.value;

      if (value && (unreported || value !== reported)) {
        reported = value;
        list.reportBatch(batchIndex, value);
      }
    });

    return () => null;
  },
});

composition(ListComposableBatchLoader);

export default ListComposableBatchLoader;
