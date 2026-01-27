import type { FC, PropsWithChildren } from "react";
import styles from "./MessageSeparator.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import React from "react";
import clsx from "clsx";
import { Separator } from "@/components/Separator";
import { Content } from "@/components/Content";

export interface MessageSeparatorProps
  extends PropsWithChildren, PropsWithClassName {}

/** @flr-generate all */
export const MessageSeparator: FC<MessageSeparatorProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.messageSeparator, className);

  return (
    <span className={rootClassName}>
      <Separator className={styles.separator} />
      <Content className={styles.content}>{children}</Content>
    </span>
  );
};
export default MessageSeparator;
