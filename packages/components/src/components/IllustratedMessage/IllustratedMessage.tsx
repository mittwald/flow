import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./IllustratedMessage.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface IllustratedMessageProps
  extends PropsWithChildren<ComponentProps<"div">> {
  /** The color of the illustrated message. @default "primary" */
  color?: "primary" | "danger" | "light" | "dark";
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const IllustratedMessage: FC<IllustratedMessageProps> = (props) => {
  const { className, children, color = "primary", ...rest } = props;

  const rootClassName = clsx(
    styles.illustratedMessage,
    className,
    styles[color],
  );

  const lightOrDarkColor =
    color === "dark" || color === "light" ? color : undefined;

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      size: "l",
    },
    Heading: {
      className: styles.heading,
      color: lightOrDarkColor,
    },
    Text: {
      className: styles.text,
      color: lightOrDarkColor,
    },
    Button: {
      color: lightOrDarkColor ?? "accent",
    },
    ActionGroup: {
      className: styles.actionGroup,
    },
    ProgressBar: { className: styles.progressBar },
  };

  return (
    <div {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default IllustratedMessage;
