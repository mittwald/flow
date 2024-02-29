import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Switch.module.scss";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface SwitchProps
  extends PropsWithChildren<Omit<Aria.SwitchProps, "children">> {
  /** @default "trailing" */
  labelPosition?: "leading" | "trailing";
  /** @default "success" */
  variant?: "success" | "danger";
}

export const Switch: FC<SwitchProps> = (props) => {
  const {
    children,
    className,
    labelPosition = "trailing",
    variant = "success",
    ...rest
  } = useProps("Switch", props);

  const rootClassName = clsx(
    styles.switch,
    styles[`label-${labelPosition}`],
    styles[variant],
    className,
  );

  return (
    <Aria.Switch {...rest} className={rootClassName}>
      <div className={styles.indicator} />
      {children}
    </Aria.Switch>
  );
};

export default Switch;
