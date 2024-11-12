import type { FC, PropsWithChildren } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./Message.module.scss";
import Text from "@mittwald/flow-react-components/Text";
import type { DateTime } from "luxon";
import { Content } from "@mittwald/flow-react-components/Content";

export interface MessageProps extends PropsWithChildren {
  /** @default "sender" */
  type?: "responder" | "sender" | "internal";
  date: DateTime;
}

export const Message: FC<MessageProps> = (props) => {
  const { type = "sender", children } = props;

  const rootClassName = clsx(styles.message, styles[type]);

  return (
    <article className={rootClassName}>
      <Content className={styles.messageContent}>
        <Text>{children}</Text>
      </Content>
    </article>
  );
};

export default Message;
