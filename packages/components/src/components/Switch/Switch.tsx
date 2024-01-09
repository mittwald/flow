import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Switch.module.css";
import clsx from "clsx";

export interface SwitchProps
  extends PropsWithChildren<Omit<Aria.SwitchProps, "children">> {
  order: "labelFirst" | "indicatorFirst";
  variant: "accent" | "negative";
}

export const Switch: FC<SwitchProps> = (props) => {
  const {
    children,
    className,
    order = "indicatorFirst",
    variant = "accent",
    ...rest
  } = props;

  const rootClassName = clsx(
    className,
    styles.root,
    styles[order],
    styles[variant],
  );

  return (
    <Aria.Switch {...rest} className={rootClassName}>
      <div className={styles.indicator} />
      {children}
    </Aria.Switch>
  );
};

export default Switch;
