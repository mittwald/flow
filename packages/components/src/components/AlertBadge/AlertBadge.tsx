import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./AlertBadge.module.scss";
import clsx from "clsx";
import { AlertIcon } from "@/components/AlertIcon";
import { Text } from "@/components/Text";
import type { PropsWithClassName, PropsWithStatus } from "@/lib/types/props";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface AlertBadgeProps
  extends PropsWithChildren,
    PropsWithStatus,
    FlowComponentProps,
    PropsWithClassName {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const AlertBadge = flowComponent<"AlertBadge", HTMLDivElement>(
  "AlertBadge",
  (props) => {
    const { children, className, status = "info", ref, ...rest } = props;

    const rootClassName = clsx(styles.alertBadge, styles[status], className);

    return (
      <ClearPropsContext>
        <div className={rootClassName} {...rest} ref={ref}>
          <AlertIcon size="s" className={styles.alertIcon} status={status} />
          <Text className={styles.text}>{children}</Text>
        </div>
      </ClearPropsContext>
    );
  },
);

export default AlertBadge;
