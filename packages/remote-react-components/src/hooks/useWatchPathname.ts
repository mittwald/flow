import { useEffect, useRef } from "react";

type Callback = (pathname: string) => void;

export const useWatchPathname = (callback: Callback) => {
  const storedHref = useRef<string | undefined>(
    typeof location === "undefined" ? undefined : location.href,
  );

  useEffect(() => {
    if (typeof location === "undefined") {
      return;
    }

    /** Need to poll here, because no appropriate browser API exists */
    const checker = setInterval(() => {
      const href = location.href;
      if (href !== storedHref.current) {
        const url = new URL(href);
        callback(url.pathname + url.search);
        storedHref.current = href;
      }
    }, 50);

    return () => {
      clearInterval(checker);
    };
  }, [storedHref]);
};
