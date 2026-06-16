import { useEffect, useState } from "react";
import type { ResolvedTheme } from "../types";
import { ColorSchemeMediaQuery } from "../lib/ColorSchemeMediaQuery";

export const useSystemTheme = (): ResolvedTheme => {
  const { preferred } = ColorSchemeMediaQuery.getPreference();

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(preferred);

  useEffect(
    () =>
      ColorSchemeMediaQuery.onPreferenceChange((newPreferred) => {
        setSystemTheme(newPreferred.preferred);
      }),
    [],
  );

  return systemTheme;
};
