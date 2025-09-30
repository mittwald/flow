import type { PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./Message.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import type { PropsContext } from "@/lib/propsContext";
import { IconContextMenu } from "@/components/Icon/components/icons";
import { PropsContextProvider } from "@/lib/propsContext";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
export interface MessageProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {
  /** Determines the color and orientation of the message. @default "responder" */
  type?: "responder" | "sender";
}

/** @flr-generate all */
export const Message = flowComponent("Message", (props) => {
  const { type = "responder", children, className } = props;

  const rootClassName = clsx(styles.message, styles[type], className);

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
      Align: {
        className: styles.user,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <article className={rootClassName}>{children}</article>
    </PropsContextProvider>
  );
});

export default Message;
