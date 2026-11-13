import type { PropsWithChildren } from "react";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { Theme } from "@/lib/theming/types";
import { ThemeScopeContext } from "@/lib/theming/context";
import { themeHtmlAttribute } from "@/lib/theming/lib/keys";
import styles from "./ThemeScope.module.scss";

export interface ThemeScopeProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps<HTMLDivElement> {
  /**
   * The theme of the content, independent of the page. `system` follows the
   * operating system's preference.
   */
  theme: Theme;
}

/**
 * @flowStatus beta, new
 * @flr-generate all
 */
export const ThemeScope = flowComponent(
  "ThemeScope",
  (props) => {
    const { theme, children, className, ref } = props;

    return (
      <div
        ref={ref}
        className={clsx(styles.themeScope, className)}
        {...{ [themeHtmlAttribute]: theme }}
      >
        <ThemeScopeContext value={theme}>{children}</ThemeScopeContext>
      </div>
    );
  },
  { type: "layout" },
);

export default ThemeScope;
