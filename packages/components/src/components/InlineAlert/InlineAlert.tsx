import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import styles from "./InlineAlert.module.scss";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import type { PropsWithStatus } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface InlineAlertProps
  extends PropsWithChildren<ComponentProps<"aside">>,
    PropsWithStatus,
    FlowComponentProps {}

export const InlineAlert = flowComponent("InlineAlert", (props) => {
  const { children, className, status = "info", ref, ...rest } = props;

  const rootClassName = clsx(styles.inlineAlert, styles[status], className);

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 3,
    },
    Content: {
      className: styles.content,
      Button: {
        size: "s",
      },
    },
    Skeleton: {
      className: styles.skeleton,
    },
  };

  return (
    <ClearPropsContext>
      <aside {...rest} className={rootClassName} ref={ref}>
        <StatusIcon className={styles.statusIcon} status={status} />
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </aside>
    </ClearPropsContext>
  );
});

export default InlineAlert;
