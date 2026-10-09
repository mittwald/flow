import { watchMobxValue } from "@/lib/mobxSelector";
import type { Ref } from "vue";
import { injectListModel } from "./listContext";

/**
 * What the loader reported beside its data.
 *
 * The counterpart of React's `useListMetadata`: a loader returns `{ data,
 * itemTotalCount, metadata }`, and `metadata` is whatever the source sends
 * along — a cursor, a facet count, an API's own envelope. The list does not
 * read it; this is how the app gets it back.
 *
 * A ref, not a value: the batches arrive over time, and each one may bring new
 * metadata. Call it inside a `<List>`, where the list can be injected.
 */
export const useListMetadata = <T = unknown>(): Readonly<
  Ref<T | undefined>
> => {
  const list = injectListModel();
  return watchMobxValue(() => list.loaderState.metadata as T | undefined);
};

export default useListMetadata;
