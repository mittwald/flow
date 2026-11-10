import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import styles from "./Tooltip.module.scss";
import clsx from "clsx";
import { ClearPropsContext } from "@/components/ClearPropsContext";
import { useIsActivityActive } from "@/components/Activity/context";
import { useOverlayThemeProps } from "@/lib/theming/useOverlayThemeProps";

export type TooltipProps = PropsWithChildren<
  Omit<Aria.TooltipProps, "children">
>;

/** @flr-generate all */
export const Tooltip: FC<TooltipProps> = (props) => {
  const { children, className, ...rest } = props;

  const isActivityActive = useIsActivityActive();
  const themeProps = useOverlayThemeProps();

  const rootClassName = clsx(styles.tooltip, className);

  if (!isActivityActive) {
    return null;
  }

  return (
    <ClearPropsContext>
      <Aria.Tooltip {...rest} {...themeProps} className={rootClassName}>
        <Aria.OverlayArrow className={styles.tip}>
          <svg className={styles.tipIcon} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </Aria.OverlayArrow>
        {children}
      </Aria.Tooltip>
    </ClearPropsContext>
  );
};

export default Tooltip;
