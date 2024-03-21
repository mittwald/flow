import React, { FC, PropsWithChildren } from "react";
import styles from "./StatusBadge.module.scss";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { Text } from "@/components/Text";
import { PropsWithStatus } from "@/lib/types/props";
import { Badge } from "@/components/Badge";
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
      <Badge className={rootClassName} {...rest}>
        <StatusIcon size="s" className={styles.statusIcon} status={status} />
        <Text className={styles.text}>{children}</Text>
      </Badge>
    </ClearPropsContext>
  );
};

export default StatusBadge;
