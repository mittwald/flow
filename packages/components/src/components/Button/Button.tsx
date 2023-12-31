import React, { FC, PropsWithChildren } from "react";
import styles from "./Button.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";

export interface ButtonProps extends PropsWithChildren<Aria.ButtonProps> {
  /** @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "negative";
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    variant = "primary",
    children,
    className: classNameFromProps,
    ...restProps
  } = useProps("button", props);

  const className = clsx(classNameFromProps, styles.root, styles[variant]);

  const propsContext: PropsContext = {
    text: {
      className: styles.text,
    },
    icon: {
      className: styles.icon,
    },
  };

  return (
    <Aria.Button className={className} {...restProps}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.Button>
  );
};

export default Button;
