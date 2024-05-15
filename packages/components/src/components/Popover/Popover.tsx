import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Popover.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export type PopoverProps = PropsWithChildren<
  Omit<Aria.PopoverProps, "children">
>;

export const Popover: FC<PopoverProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.popover, className);

  return (
    <Aria.Popover {...rest} className={rootClassName}>
      {children}
    </Aria.Popover>
  );
};

export default Popover;
