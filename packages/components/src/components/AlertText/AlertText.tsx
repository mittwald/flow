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

export interface AlertTextProps
  extends PropsWithStatus,
    PropsWithClassName,
    PropsWithChildren,
    FlowComponentProps {}

/** @flr-generate all */
export const AlertText = flowComponent("AlertText", (props) => {
  const { className, children, status = "info" } = props;

  const rootClassName = clsx(styles.alertText, styles[status], className);

  return (
    <span className={rootClassName}>
      <PropsContextProvider props={{ Icon: { size: "s" } }}>
        <AlertIcon status={status} className={styles.icon} />
      </PropsContextProvider>
      <>{children}</>
    </span>
  );
});

export default AlertText;
