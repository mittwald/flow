import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Popover.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface PopoverProps
  extends PropsWithChildren<Omit<Aria.PopoverProps, "children">> {
  withTip?: boolean;
}

export const Popover: FC<PopoverProps> = (props) => {
  const { children, className, withTip, ...rest } = props;

  const rootClassName = clsx(styles.popover, className);

  return (
    <Aria.Popover {...rest} className={rootClassName} containerPadding={8}>
      {withTip && (
        <Aria.OverlayArrow className={styles.tip}>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </Aria.OverlayArrow>
      )}
      <div className={styles.content}>{children}</div>
    </Aria.Popover>
  );
};

export default Popover;
