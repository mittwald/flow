import type { CSSProperties, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import styles from "./Chat.module.scss";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface ChatProps extends PropsWithChildren, PropsWithClassName {
  // Height of the chat component
  height?: CSSProperties["height"];
}

/** @flr-generate all */
export const Chat: FC<ChatProps> = flowComponent(
  "Chat",
  (props) => {
    const { height, className, children } = props;

    const rootClassName = clsx(styles.chat, className);

    const propsContext: PropsContext = {
      MessageThread: {
        tunnel: {
          id: "messageThread",
          component: "Chat",
        },
      },
      FileCardList: {
        className: styles.fileCardList,
        tunnel: {
          id: "fileCardList",
          component: "Chat",
        },
      },
      Button: {
        className: dynamic((props) => {
          return props.color === "accent" ? styles.accentButton : styles.button;
        }),
      },
    };

    return (
      <PropsContextProvider props={propsContext}>
        <div style={{ height }} className={rootClassName}>
          <div className={styles.messageThreadContainer}>
            <UiComponentTunnelExit id="messageThread" component="Chat" />
          </div>
          <div className={styles.controls}>{children}</div>
          <UiComponentTunnelExit id="fileCardList" component="Chat" />
        </div>
      </PropsContextProvider>
    );
  },
  {
    type: "layout",
  },
);

export default Chat;
