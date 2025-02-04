import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./MessageThread.module.scss";

export type MessageThreadProps = PropsWithChildren & PropsWithClassName;

export const MessageThread: FC<MessageThreadProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.messageThread, className);

  return <div className={rootClassName}>{children}</div>;
};
