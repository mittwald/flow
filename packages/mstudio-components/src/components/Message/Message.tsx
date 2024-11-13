import type { FC, PropsWithChildren } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./Message.module.scss";
import type { PropsContext } from "@mittwald/flow-react-components/PropsContext";
import PropsContextProvider from "@mittwald/flow-react-components/PropsContextProvider";
import { IconContextMenu } from "@mittwald/flow-react-components/Icons";
import type { PropsWithClassName } from "@mittwald/flow-react-components/props";

export interface MessageProps extends PropsWithChildren, PropsWithClassName {
  /** @default "sender" */
  type?: "responder" | "sender" | "internal";
  orientation?: "left" | "right";
  shared?: boolean;
}

export const Message: FC<MessageProps> = (props) => {
  const {
    type = "sender",
    children,
    className,
    orientation = "left",
    shared,
  } = props;

  const rootClassName = clsx(
    styles.message,
    styles[type],
    styles[orientation],
    shared && styles.shared,
    className,
  );

  const propsContext: PropsContext = {
    Content: { className: styles.content },
    Header: {
      className: styles.header,
      Button: {
        className: styles.action,
        size: "s",
        variant: "plain",
        color: "secondary",
      },
      ContextMenuTrigger: {
        Button: {
          className: styles.action,
          size: "s",
          variant: "plain",
          color: "secondary",
          children: <IconContextMenu />,
        },
      },
      Text: { className: styles.date },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <article className={rootClassName}>{children}</article>
    </PropsContextProvider>
  );
};

export default Message;
