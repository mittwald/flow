import React, { ComponentProps, PropsWithChildren } from "react";
import {
  ClearPropsContext,
  PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import styles from "./InlineAlert.module.scss";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { PropsWithStatus } from "@/lib/types/props";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface InlineAlertProps
  extends PropsWithChildren<ComponentProps<"aside">>,
    PropsWithStatus,
    FlowComponentProps {}

export const InlineAlert = flowComponent("InlineAlert", (props) => {
  const { children, className, status = "info", ...rest } = props;

  const rootClassName = clsx(styles.inlineAlert, styles[status], className);

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 3,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <ClearPropsContext>
      <aside {...rest} className={rootClassName}>
        <StatusIcon className={styles.statusIcon} status={status} />
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </aside>
    </ClearPropsContext>
  );
});

export default InlineAlert;
