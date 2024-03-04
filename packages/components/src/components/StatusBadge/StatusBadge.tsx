import React, { FC, PropsWithChildren } from "react";
import styles from "./StatusBadge.module.scss";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { Text } from "@/components/Text";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { PropsWithStatus } from "@/lib/types/props";

export interface StatusBadgeProps extends PropsWithChildren, PropsWithStatus {
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = (props) => {
  const { children, className, status = "info", ...rest } = props;

  const rootClassName = clsx(styles.statusBadge, styles[status], className);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.customIcon,
      size: "s",
    },
    Text: {
      className: styles.content,
    },
  };

  return (
    <div className={rootClassName} {...rest}>
      <StatusIcon size="s" className={styles.statusIcon} status={status} />
      <PropsContextProvider props={propsContext}>
        {typeof children === "string" ? <Text>{children}</Text> : children}
      </PropsContextProvider>
    </div>
  );
};

export default StatusBadge;
