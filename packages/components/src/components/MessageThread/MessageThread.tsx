import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import styles from "./MessageThread.module.scss";

export type MessageThreadProps = PropsWithChildren &
  PropsWithClassName &
  FlowComponentProps;

/** @flr-generate all */
export const MessageThread = flowComponent("MessageThread", (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.messageThread, className);

  const propsContext: PropsContext = {
    Message: {
      className: dynamic((props) => {
        return clsx(
          props.className,
          styles.message,
          styles[props.type ?? "responder"],
        );
      }),
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <div className={rootClassName}>{children}</div>
    </PropsContextProvider>
  );
});
