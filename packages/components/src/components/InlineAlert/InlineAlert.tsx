import type { PropsWithChildren } from "react";
import type { PropsWithClassName, PropsWithStatus } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./InlineAlert.module.scss";
import { AlertIcon } from "@/components/AlertIcon";
import { Text } from "@/components/Text";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { PropsContextProvider } from "@/lib/propsContext";

export interface InlineAlertProps
  extends PropsWithStatus,
    PropsWithClassName,
    PropsWithChildren,
    FlowComponentProps {}

/** @flr-generate all */
export const InlineAlert = flowComponent("InlineAlert", (props) => {
  const { className, children, status = "info" } = props;

  const rootClassName = clsx(styles.inlineAlert, styles[status], className);

  return (
    <span className={rootClassName}>
      <PropsContextProvider props={{ Icon: { size: "s" } }}>
        <AlertIcon status={status} className={styles.icon} />
      </PropsContextProvider>
      <Text>{children}</Text>
    </span>
  );
});

export default InlineAlert;
