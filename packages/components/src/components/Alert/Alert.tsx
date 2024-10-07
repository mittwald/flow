import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import styles from "./Alert.module.scss";
import clsx from "clsx";
import { AlertIcon } from "@/components/AlertIcon";
import type { PropsWithStatus } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface AlertProps
  extends PropsWithChildren<ComponentProps<"aside">>,
    PropsWithStatus,
    FlowComponentProps {}

export const Alert = flowComponent("Alert", (props) => {
  const { children, className, status = "info", refProp: ref, ...rest } = props;

  const rootClassName = clsx(styles.alert, styles[status], className);

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 3,
      size: "s",
    },
    Content: {
      className: styles.content,
      Button: {
        size: "s",
      },
    },
  };

  return (
    <ClearPropsContext>
      <aside {...rest} className={rootClassName} ref={ref}>
        <AlertIcon className={styles.alertIcon} status={status} />
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </aside>
    </ClearPropsContext>
  );
});

export default Alert;
