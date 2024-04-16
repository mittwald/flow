import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./IllustratedMessage.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface IllustratedMessageProps
  extends PropsWithChildren<ComponentProps<"div">> {
  variant?: "info" | "negative";
}

export const IllustratedMessage: FC<IllustratedMessageProps> = (props) => {
  const { className, children, variant = "info", ...rest } = props;

  const rootClassName = clsx(
    styles.illustratedMessage,
    styles[variant],
    className,
  );

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      size: "l",
    },
    Heading: {
      className: styles.heading,
    },
    Text: {
      className: styles.text,
    },
    Button: {
      className: styles.button,
      variant: "accent",
    },
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
