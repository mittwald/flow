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
    <Aria.Popover {...rest} className={rootClassName} containerPadding={16}>
      {withTip && (
        <Aria.OverlayArrow className={styles.tip}>
          <svg width={16} height={16} viewBox="0 0 16 16">
            <path d="M0 0 L8 8 L16 0" />
          </svg>
        </Aria.OverlayArrow>
      )}
      <div className={styles.content}>{children}</div>
    </Aria.Popover>
  );
};

export default Popover;
