import { AlertIcon } from "@/components/AlertIcon";
import { Text } from "@/components/Text";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName, PropsWithStatus } from "@/lib/types/props";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import styles from "./AlertBadge.module.scss";

export interface AlertBadgeProps
  extends PropsWithChildren,
    PropsWithStatus,
    FlowComponentProps,
    PropsWithClassName {}

/** @flr-generate all */
export const AlertBadge = flowComponent<"AlertBadge", HTMLDivElement>(
  "AlertBadge",
  (props) => {
    const { children, className, status = "info", ref, ...rest } = props;

    const rootClassName = clsx(styles.alertBadge, styles[status], className);

    return (
      <ClearPropsContextView>
        <div className={rootClassName} {...rest} ref={ref}>
          <AlertIcon size="s" className={styles.alertIcon} status={status} />
          <Text className={styles.text}>{children}</Text>
        </div>
      </ClearPropsContextView>
    );
  },
);

export default AlertBadge;
