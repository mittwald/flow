import useSelector from "@/lib/mobx/useSelector";
import { useStatic } from "@/lib/hooks/useStatic";
import type List from "@/components/List/model/List";
import { ListLoaderState } from "@mittwald/flow-components-base";

/**
 * React's view of the list's loading state.
 *
 * Everything the state _is_ — the batches, the deduplication, what counts as
 * loading — lives in `ListLoaderState` in `@mittwald/flow-components-base`, so
 * the Vue binding runs the same rules rather than a second implementation of
 * them. What is left here is the subscription: MobX is framework-agnostic,
 * reading it in a component is not.
 */
export class IncrementalLoaderState<T> extends ListLoaderState<T> {
  public readonly list: List<T>;

  private constructor(list: List<T>) {
    super({ getItemId: list.getItemId });
    this.list = list;
  }

  public static useNew<T>(list: List<T>): IncrementalLoaderState<T> {
    return useStatic(() => new IncrementalLoaderState<T>(list));
  }

  public useMergedData(): T[] {
    return useSelector(() => this.mergedData, [this.prevDataBatches]);
  }

  public useIsLoading(): boolean {
    return useSelector(() => this.isLoading);
  }

  public useIsLoadingMore(): boolean {
    return useSelector(() => this.isLoadingMore);
  }

  public useIsInitiallyLoading(): boolean {
    return useSelector(() => this.isInitiallyLoading);
  }
}
