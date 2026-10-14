import type { PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./MessageThread.module.scss";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

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
          styles.message,
          styles[props.type ?? "responder"],
          props.className,
        );
      }),
      elementType: "li",
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <ul className={rootClassName}>{children}</ul>
    </PropsContextProvider>
  );
});

export default MessageThread;
