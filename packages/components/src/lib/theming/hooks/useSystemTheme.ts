import { useEffect, useState } from "react";
import type { ResolvedTheme } from "../types";

export const useSystemTheme = (): ResolvedTheme => {
  const media =
    typeof window === "undefined"
      ? null
      : window.matchMedia("(prefers-color-scheme: light)");

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(
    media?.matches ? "light" : "dark",
  );

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "light" : "dark");
    };

    media?.addEventListener("change", listener);

    return () => {
      media?.removeEventListener("change", listener);
    };
  }, []);

  return systemTheme;
};
