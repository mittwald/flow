import type { CSSProperties, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import styles from "./Chat.module.scss";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface ChatProps extends PropsWithChildren, PropsWithClassName {
  // Height of the chat component
  height?: CSSProperties["height"];
}

/** @flr-generate all */
export const Chat: FC<ChatProps> = (props) => {
  const { height, className, children } = props;

  const rootClassName = clsx(styles.chat, className);

  const propsContext: PropsContext = {
    MessageThread: {
      tunnelId: "messageThread",
    },
    FileCardList: { className: styles.fileCardList, tunnelId: "fileCardList" },
    Button: {
      className: dynamic((props) => {
        return props.color === "accent" ? styles.accentButton : styles.button;
      }),
    },
    TextArea: { className: styles.textInput },
    TextField: { className: styles.textInput },
  };

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <div style={{ height }} className={rootClassName}>
        <TunnelProvider>
          <div className={styles.messageThreadContainer}>
            <TunnelExit id="messageThread" />
          </div>
          <div className={styles.controls}>{children}</div>
          <TunnelExit id="fileCardList" />
        </TunnelProvider>
      </div>
    </PropsContextProvider>
  );
};

export default Chat;
