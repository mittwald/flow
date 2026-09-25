/**
 * Reports the remote app's own pathname, so the backoffice URL follows the
 * extension's navigation.
 *
 * Polled, like the React counterpart: no browser API fires on a `pushState` the
 * app performs itself. Has to be called while a component initializes.
 */
export const watchPathname = (callback: (pathname: string) => void): void => {
  $effect(() => {
    if (typeof location === "undefined") {
      return;
    }

    let storedHref = location.href;

    const checker = setInterval(() => {
      const href = location.href;
      if (href !== storedHref) {
        const url = new URL(href);
        callback(url.pathname + url.search);
        storedHref = href;
      }
    }, 50);

    return () => clearInterval(checker);
  });
};
