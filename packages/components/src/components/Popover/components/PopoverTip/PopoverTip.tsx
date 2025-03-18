import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import type { FC } from "react";
import styles from "../../Popover.module.scss";
import * as Aria from "react-aria-components";

export const PopoverTip: FC<PropsWithClassName> = (props) => {
  const { className } = props;
  const rootClassName = clsx(styles.tip, className);

  return (
    <Aria.OverlayArrow className={rootClassName}>
      <svg width={16} height={16} viewBox="0 0 16 16">
        <path d="M0 0 L8 8 L16 0" />
      </svg>
    </Aria.OverlayArrow>
  );
};
