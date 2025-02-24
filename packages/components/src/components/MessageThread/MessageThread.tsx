import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./MessageThread.module.scss";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";

export type MessageThreadProps = PropsWithChildren & PropsWithClassName;

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const MessageThread: FC<MessageThreadProps> = (props) => {
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
};
