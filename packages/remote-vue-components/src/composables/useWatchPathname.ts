import { onBeforeUnmount, onMounted } from "vue";

/**
 * Reports the remote app's own pathname to the host, so the backoffice URL
 * follows the extension's navigation.
 *
 * Polled, like the React counterpart: no browser API fires on a `pushState` the
 * app performs itself.
 */
export const useWatchPathname = (
  callback: (pathname: string) => void,
): void => {
  let storedHref = typeof location === "undefined" ? undefined : location.href;
  let checker: ReturnType<typeof setInterval> | undefined;

  onMounted(() => {
    if (typeof location === "undefined") {
      return;
    }

    checker = setInterval(() => {
      const href = location.href;
      if (href !== storedHref) {
        const url = new URL(href);
        callback(url.pathname + url.search);
        storedHref = href;
      }
    }, 50);
  });

  onBeforeUnmount(() => clearInterval(checker));
};
