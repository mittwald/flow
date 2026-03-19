import { useEffect, useState } from "react";
import type { Theme } from "../types";
import { themeHtmlAttribute } from "../lib/keys";
import { getStoredTheme } from "../lib/getStoredTheme";

export const useStoredTheme = (): Theme => {
  const initialTheme = getStoredTheme();
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const mutationObserver = new MutationObserver((changes) => {
      for (const change of changes) {
        if (
          change.type === "attributes" &&
          change.attributeName === themeHtmlAttribute
        ) {
          setTheme(getStoredTheme());
        }
      }
    });

    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [themeHtmlAttribute],
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [setTheme]);

  return theme;
};
