import type { PropsWithChildren } from "react";
import styles from "./AlertBadge.module.scss";
import clsx from "clsx";
import { AlertIcon } from "@/components/AlertIcon";
import { Text } from "@/components/Text";
import type {
  PropsWithClassName,
  PropsWithStatus,
  Status,
} from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface AlertBadgeProps
  extends PropsWithChildren,
    PropsWithStatus<Exclude<Status, "unavailable">>,
    FlowComponentProps<HTMLDivElement>,
    PropsWithClassName {}

/** @flr-generate all */
export const AlertBadge = flowComponent("AlertBadge", (props) => {
  const { children, className, status = "info", ref, ...rest } = props;

  const rootClassName = clsx(styles.alertBadge, styles[status], className);

  return (
    <div className={rootClassName} {...rest} ref={ref}>
      <AlertIcon size="s" status={status} />
      <Text className={styles.text}>{children}</Text>
    </div>
  );
});

export default AlertBadge;
