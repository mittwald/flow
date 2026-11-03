import type { PropsWithChildren } from "react";
import type { PropsWithClassName, PropsWithStatus } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./AlertText.module.scss";
import { AlertIcon } from "@/components/AlertIcon";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { PropsContextProvider } from "@/lib/propsContext";
import { SkeletonTextContent } from "@/components/SkeletonMode/components/SkeletonTextContent";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export interface AlertTextProps
  extends
    PropsWithClassName,
    PropsWithChildren,
    FlowComponentProps<HTMLSpanElement>,
    PropsWithStatus {}

/** @flr-generate all */
export const AlertText = flowComponent("AlertText", (props) => {
  const { className, children, status = "info", ...rest } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(styles.alertText, styles[status], className);

  return (
    <span {...rest} className={rootClassName} inert={isSkeleton || undefined}>
      <PropsContextProvider props={{ Icon: { size: "s" } }}>
        <AlertIcon status={status} className={styles.icon} />
      </PropsContextProvider>

      <SkeletonTextContent defaultWidth="8em">{children}</SkeletonTextContent>
    </span>
  );
});

export default AlertText;
