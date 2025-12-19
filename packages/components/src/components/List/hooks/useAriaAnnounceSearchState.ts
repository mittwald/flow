import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import { announce } from "@react-aria/live-announcer";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect } from "react";
import { useList } from "@/components/List/hooks/useList";

const announceDebounceMs = 600;

export const useAriaAnnounceSearchState = (): void => {
  const formatter = useLocalizedStringFormatter(locales);
  const list = useList();
  const debouncedAnnounce = useDebounceCallback(announce, announceDebounceMs);

  const searchTerm = list.search?.value;
  const resultCount = list.batches.getTotalItemsCount();
  const isLoading = list.loader.loaderState.useIsLoading();

  useEffect(() => {
    if (isLoading || !searchTerm) {
      debouncedAnnounce.cancel();
      return;
    }

    const text = formatter.format(
      resultCount > 0
        ? "list.search.announce.result"
        : "list.search.announce.noResult",
      {
        resultCount,
        searchTerm,
      },
    );

    debouncedAnnounce(text, "polite");
  }, [searchTerm, resultCount, isLoading]);
};
