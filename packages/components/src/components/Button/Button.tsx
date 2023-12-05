import React, { FC, PropsWithChildren } from "react";
import styles from "./styles.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface ButtonProps extends Omit<Aria.ButtonProps, "children"> {
  variant: "accent" | "primary" | "secondary" | "negative";
}

export const Button: FC<PropsWithChildren<ButtonProps>> = (props) => {
  const { variant, children, ...rest } = props;

  const className = clsx(props.className, styles.root, {
    [styles.primary]: variant === "primary",
    [styles.accent]: variant === "accent",
  });

  return (
    <Aria.Button {...rest} className={className}>
      {children}
    </Aria.Button>
  );
};

export default Button;
