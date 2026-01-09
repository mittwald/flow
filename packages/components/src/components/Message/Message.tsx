import type { CSSProperties, PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./Message.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { IconContextMenu } from "@/components/Icon/components/icons";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import ClearPropsContext from "@/lib/propsContext/components/ClearPropsContext";

export interface MessageProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {
  /** Determines the color and orientation of the message. @default "responder" */
  type?: "responder" | "sender";
  color?: string;
}

/** @flr-generate all */
export const Message = flowComponent("Message", (props) => {
  const { type = "responder", children, className, color } = props;

  const rootClassName = clsx(styles.message, styles[type], className);

  const style = color
    ? ({ "--message-background": color } as CSSProperties)
    : undefined;

  const propsContext: PropsContext = {
    Content: {
      className: styles.content,
      children: dynamic((props) => {
        return (
          <>
            <div className={styles.tip} />
            {props.children}
          </>
        );
      }),
    },
    Header: {
      className: styles.header,
      Button: {
        className: styles.headerAction,
        size: "s",
        variant: "plain",
        color: "secondary",
      },
      ContextMenuTrigger: {
        Button: {
          className: styles.headerAction,
          size: "s",
          variant: "plain",
          color: "secondary",
          children: <IconContextMenu />,
        },
      },
      Text: { className: styles.date },
      Align: {
        wrapWith: <ClearPropsContext />,
        className: styles.user,
      },
    },

    Button: {
      size: "s",
      className: styles.action,
    },
    ActionGroup: {
      className: styles.actionGroup,
      Button: {
        size: "s",
        className: styles.actionGroupAction,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <article className={rootClassName} style={style}>
        {children}
      </article>
    </PropsContextProvider>
  );
});

export default Message;
