import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./Kbd.module.scss";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { Fragment, type PropsWithChildren } from "react";
import { isAppleDevice } from "@react-aria/utils";

export interface KbdProps
  extends PropsWithClassName, FlowComponentProps, PropsWithChildren {
  /** Array of keys to be joined */
  keys?: (string | "mod" | "alt" | "shift")[];
  /** Whether the component is displayed as disabled */
  isDisabled?: boolean;
  /** The visual variant @default "plain" */
  variant?: "plain" | "soft";
}

/** @flr-generate all */
export const Kbd = flowComponent("Kbd", (props) => {
  const {
    keys,
    className,
    isDisabled,
    children,
    variant = "plain",
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.kbd,
    isDisabled && styles.disabled,
    className,
    styles[variant],
  );

  const stringFormatter = useLocalizedStringFormatter(locales);

  const joinedKeys = keys?.map((key, index) => {
    let formattedKey = key;

    if (key === "mod") {
      formattedKey = isAppleDevice() ? "⌘" : stringFormatter.format("kbd.mod");
    }
    if (key === "alt") {
      formattedKey = isAppleDevice() ? "⌥" : stringFormatter.format("kbd.alt");
    }
    if (key === "shift") {
      formattedKey = "⇧";
    }

    if (keys?.length === 1) {
      return <Fragment key={index}>{formattedKey}</Fragment>;
    }

    return (
      <Fragment key={index}>
        <kbd className={styles.kbd}>{formattedKey}</kbd>
        {index < keys.length - 1 && " + "}
      </Fragment>
    );
  });

  return (
    <kbd className={rootClassName} {...rest}>
      {joinedKeys ?? children}
    </kbd>
  );
});
