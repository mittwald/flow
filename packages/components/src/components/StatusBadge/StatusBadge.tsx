import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./StatusBadge.module.scss";
import clsx from "clsx";
import { AlertIcon } from "@/components/AlertIcon";
import { Text } from "@/components/Text";
import type { PropsWithClassName, PropsWithStatus } from "@/lib/types/props";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface StatusBadgeProps
  extends PropsWithChildren,
    PropsWithStatus,
    FlowComponentProps,
    PropsWithClassName {}

export const StatusBadge = flowComponent("StatusBadge", (props) => {
  const { children, className, status = "info", refProp: ref, ...rest } = props;

  const rootClassName = clsx(styles.statusBadge, styles[status], className);

  return (
    <ClearPropsContext>
      <div className={rootClassName} {...rest} ref={ref}>
        <AlertIcon size="s" className={styles.alertIcon} status={status} />
        <Text className={styles.text}>{children}</Text>
      </div>
    </ClearPropsContext>
  );
});

export default StatusBadge;
