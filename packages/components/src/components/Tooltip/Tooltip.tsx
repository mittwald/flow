import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Tooltip.module.scss";
import clsx from "clsx";

export type TooltipProps = PropsWithChildren<
  Omit<Aria.TooltipProps, "children">
>;

export const Tooltip: FC<TooltipProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tooltip, className);

  return (
    <Aria.Tooltip {...rest} className={rootClassName}>
      <Aria.OverlayArrow className={styles.arrow}>
        <svg viewBox="0 0 8 8">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </Aria.OverlayArrow>
      {children}
    </Aria.Tooltip>
  );
};

export default Tooltip;
