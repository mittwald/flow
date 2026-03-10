import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./ShortcutKey.module.scss";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsWithChildren } from "react";

export interface ShortcutKeyProps
  extends PropsWithClassName, FlowComponentProps, PropsWithChildren {
  keys?: (string | "mod" | "alt" | "shift")[];
  isDisabled?: boolean;
}

/** @flr-generate all */
export const ShortcutKey = flowComponent("ShortcutKey", (props) => {
  const { keys, className, isDisabled, children, ...rest } = props;

  const rootClassName = clsx(
    styles.shortcutKey,
    isDisabled && styles.disabled,
    className,
  );

  const stringFormatter = useLocalizedStringFormatter(locales);

  const isMac = navigator.userAgent.includes("Mac");

  const joinedKeys = keys
    ?.map((key) => {
      if (key === "mod") {
        return isMac ? "⌘" : stringFormatter.format(`shortcutKey.mod`);
      }
      if (key === "alt") {
        return isMac ? "⌥" : stringFormatter.format(`shortcutKey.alt`);
      }
      if (key === "shift") {
        return "⇧";
      }
      return key;
    })
    .join("+");

  return (
    <span className={rootClassName} {...rest}>
      {joinedKeys ?? children}
    </span>
  );
});
