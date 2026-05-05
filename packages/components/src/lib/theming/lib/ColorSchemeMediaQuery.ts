import type { ResolvedTheme } from "../types";
import { getTheme } from "./getTheme";
import { isClientSide } from "./isClientSide";

interface ColorSchemaPreference {
  dark: boolean;
  light: boolean;
  preferred: ResolvedTheme;
}

export class ColorSchemeMediaQuery {
  private static _mediaQuery?: MediaQueryList;

  public static get mediaQuery() {
    if (isClientSide()) {
      if (!this._mediaQuery) {
        this._mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
      }
      return this._mediaQuery;
    }
  }

  public static getPreference(): ColorSchemaPreference {
    const fallback = getTheme();
    const fallbackResolved = fallback === "system" ? "light" : fallback;

    const preferred =
      this.mediaQuery === undefined
        ? fallbackResolved
        : this.mediaQuery.matches
          ? "light"
          : "dark";

    return {
      light: preferred === "light",
      dark: preferred === "dark",
      preferred,
    };
  }

  public static onPreferenceChange(
    callback: (preferred: ColorSchemaPreference) => void,
  ) {
    const query = this.mediaQuery;
    if (!query) {
      return;
    }

    const listener = (event: MediaQueryListEvent) => {
      if (event.type === "change") {
        callback(this.getPreference());
      }
    };

    query.addEventListener("change", listener);

    return () => {
      query.removeEventListener("change", listener);
    };
  }
}
