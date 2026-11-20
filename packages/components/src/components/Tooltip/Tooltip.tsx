import * as Aria from "react-aria-components";
import type { PropsWithChildren } from "react";
import styles from "./Tooltip.module.scss";
import clsx from "clsx";
import { useIsActivityActive } from "@/components/Activity/context";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface TooltipProps
  extends
    PropsWithChildren<Omit<Aria.TooltipProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const Tooltip = flowComponent("Tooltip", (props) => {
  const { children, className, ref, ...rest } = props;

  const isActivityActive = useIsActivityActive();

  const rootClassName = clsx(styles.tooltip, className);

  if (!isActivityActive) {
    return null;
  }

  return (
    <Aria.Tooltip {...rest} ref={ref} className={rootClassName}>
      <Aria.OverlayArrow className={styles.tip}>
        <svg className={styles.tipIcon} viewBox="0 0 8 8">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </Aria.OverlayArrow>
      {children}
    </Aria.Tooltip>
  );
});

export default Tooltip;
