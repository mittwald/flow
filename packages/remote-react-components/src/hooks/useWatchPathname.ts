import { useEffect, useRef } from "react";

type Callback = (pathname: string) => void;

export const useWatchPathname = (callback: Callback) => {
  if (typeof location === "undefined") {
    return;
  }

  const storedHref = useRef(location.href);

  useEffect(() => {
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
