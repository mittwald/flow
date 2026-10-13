import type { PropsWithChildren } from "react";
import styles from "./AlertBadge.module.scss";
import clsx from "clsx";
import { AlertIcon } from "@/components/AlertIcon";
import { Text } from "@/components/Text";
import type { PropsWithStatus, PropsWithClassName } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export interface AlertBadgeProps
  extends
    PropsWithChildren,
    PropsWithStatus,
    FlowComponentProps,
    PropsWithClassName {}

/** @flr-generate all */
export const AlertBadge = flowComponent("AlertBadge", (props) => {
  const { children, className, status = "info", ref, ...rest } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.alertBadge,
    styles[status],
    isSkeleton && styles.skeleton,
    className,
  );

  return (
    <div
      className={rootClassName}
      {...rest}
      ref={ref}
      inert={isSkeleton || undefined}
    >
      <SkeletonModeReset>
        <AlertIcon size="s" status={status} />
        <Text className={styles.text}>{children}</Text>
      </SkeletonModeReset>
    </div>
  );
});

export default AlertBadge;
