import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncOption {
  id: string;
  label: string;
}

export interface AsyncOptionPage {
  options: readonly AsyncOption[];
  /** Cursor for the next page; `undefined` means the list is exhausted. */
  cursor?: string;
}

export interface AsyncOptionLoaderArgs {
  search: string;
  cursor?: string;
  signal: AbortSignal;
}

export type AsyncOptionLoader = (
  args: AsyncOptionLoaderArgs,
) => Promise<AsyncOptionPage>;

export type AsyncOptionsLoadingState =
  "idle" | "loading" | "loadingMore" | "error";

export interface UseAsyncOptionsResult {
  options: readonly AsyncOption[];
  loadingState: AsyncOptionsLoadingState;
  error?: unknown;
  hasMore: boolean;
  loadMore: () => void;
  reload: () => void;
}

/**
 * Loads options for a search term, one cursor page at a time.
 *
 * Deliberately hand-rolled rather than `useAsyncList`: the prototype needs the
 * search term to be _the_ reset trigger and the loading state to be
 * distinguishable between "first page" and "next page", which is what drives
 * the two different UI treatments. `useAsyncList` can express this, but not
 * without fighting its `filterText`/`sortDescriptor` coupling.
 *
 * Two properties matter for issue #1851 and both live here rather than in the
 * component:
 *
 * - **A superseded request never lands.** Every load runs under an
 *   `AbortController`, and a stale response is dropped even if it resolves
 *   after the one that replaced it. Without this, typing "pro" then "prod" can
 *   leave the "pro" page on screen.
 * - **Selection is not stored here.** This hook only knows about loaded data.
 *   Selected keys live above it, which is exactly why they survive a reload.
 */
export const useAsyncOptions = (
  load: AsyncOptionLoader,
  search: string,
  options?: { debounceMs?: number },
): UseAsyncOptionsResult => {
  const debounceMs = options?.debounceMs ?? 250;

  const [pages, setPages] = useState<readonly AsyncOption[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [isExhausted, setIsExhausted] = useState(false);
  const [loadingState, setLoadingState] =
    useState<AsyncOptionsLoadingState>("loading");
  const [error, setError] = useState<unknown>(undefined);
  const [reloadToken, setReloadToken] = useState(0);

  const abortRef = useRef<AbortController | undefined>(undefined);
  const loadRef = useRef(load);
  loadRef.current = load;

  const run = useCallback(
    async (nextCursor: string | undefined, currentSearch: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoadingState(nextCursor ? "loadingMore" : "loading");
      setError(undefined);

      try {
        const page = await loadRef.current({
          search: currentSearch,
          cursor: nextCursor,
          signal: controller.signal,
        });

        // A newer request took over while this one was in flight.
        if (controller.signal.aborted) {
          return;
        }

        setPages((previous) =>
          nextCursor ? [...previous, ...page.options] : [...page.options],
        );
        setCursor(page.cursor);
        setIsExhausted(page.cursor === undefined);
        setLoadingState("idle");
      } catch (caught) {
        if (controller.signal.aborted) {
          return;
        }
        setError(caught);
        setLoadingState("error");
      }
    },
    [],
  );

  // Reset and reload whenever the search term (or an explicit reload) changes.
  useEffect(() => {
    setPages([]);
    setCursor(undefined);
    setIsExhausted(false);
    setLoadingState("loading");

    const timeout = setTimeout(() => void run(undefined, search), debounceMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, debounceMs, reloadToken, run]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const loadMore = useCallback(() => {
    if (cursor === undefined || loadingState !== "idle") {
      return;
    }
    void run(cursor, search);
  }, [cursor, loadingState, run, search]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return {
    options: pages,
    loadingState,
    error,
    hasMore: !isExhausted,
    loadMore,
    reload,
  };
};
