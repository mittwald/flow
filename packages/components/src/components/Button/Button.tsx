import React, { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "style">> {
  /** @default "primary" */
  variant?: "primary" | "success" | "secondary" | "danger";
  /** @default "solid" */
  style?: "plain" | "solid";
  /** @default "m" */
  size?: "m" | "s";
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    variant = "primary",
    style = "solid",
    children,
    className,
    size = "m",
    ...restProps
  } = useProps("Button", props);

  const rootClassName = clsx(
    styles.button,
    size === "s" && styles.small,
    styles[variant],
    styles[style],
    className,
  );

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      "aria-hidden": true,
      fixedWidth: true,
    },
  };

  return (
    <Aria.Button className={rootClassName} {...restProps}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.Button>
  );
};

export default Button;
