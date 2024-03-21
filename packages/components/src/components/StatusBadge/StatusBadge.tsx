import React, { FC, PropsWithChildren } from "react";
import styles from "./StatusBadge.module.scss";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { Text } from "@/components/Text";
import { PropsWithStatus } from "@/lib/types/props";
import { ClearPropsContext, useProps } from "@/lib/propsContext";

export interface StatusBadgeProps extends PropsWithChildren, PropsWithStatus {
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = (props) => {
  const {
    children,
    className,
    status = "info",
    ...rest
  } = useProps("StatusBadge", props);

  const rootClassName = clsx(styles.statusBadge, styles[status], className);

  return (
    <ClearPropsContext>
      <div className={rootClassName} {...rest}>
        <StatusIcon size="s" className={styles.statusIcon} status={status} />
        <Text className={styles.text}>{children}</Text>
      </div>
    </ClearPropsContext>
  );
};

export default StatusBadge;
