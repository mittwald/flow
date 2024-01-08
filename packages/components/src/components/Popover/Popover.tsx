import React, { FC, PropsWithChildren } from "react";
import styles from "./Popover.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface PopoverProps
  extends PropsWithChildren<Omit<Aria.PopoverProps, "children">> {}

export const Popover: FC<PopoverProps> = (props) => {
  const { children, className, ...rest } = useProps("popover", props);

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.Popover {...rest} className={rootClassName}>
      {children}
    </Aria.Popover>
  );
};

export default Popover;
