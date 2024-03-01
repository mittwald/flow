import React, { FC, PropsWithChildren } from "react";
import styles from "./Popover.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface PopoverProps
  extends PropsWithChildren<Omit<Aria.PopoverProps, "children">> {}

export const Popover: FC<PopoverProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.popover, className);

  return (
    <Aria.Popover {...rest} className={rootClassName}>
      <Aria.Dialog>{children}</Aria.Dialog>
    </Aria.Popover>
  );
};

export default Popover;
