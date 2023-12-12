import React, { FC, PropsWithChildren } from "react";
import styles from "./Button.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "children">> {
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

  return (
    <Aria.Button className={className} {...restProps}>
      {children}
    </Aria.Button>
  );
};

export default Button;
