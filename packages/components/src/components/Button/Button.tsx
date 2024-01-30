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
  extends PropsWithChildren<Omit<Aria.ButtonProps, "slot">> {
  /** @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "danger" | "plain";
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    variant = "primary",
    children,
    className,
    ...restProps
  } = useProps("Button", props);

  const rootClassName = clsx(styles.button, styles[variant], className);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
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
