import { type CSSProperties, type PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./Message.module.scss";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
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
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import * as Aria from "react-aria-components";

export interface MessageProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps,
    PropsWithElementType<"article" | "li"> {
  /** Determines the color and orientation of the message. @default "responder" */
  type?: "responder" | "sender";
  color?: string;
}

/** @flr-generate all */
export const Message = flowComponent("Message", (props) => {
  const {
    type = "responder",
    children,
    className,
    color,
    elementType = "article",
  } = props;

  const Element = elementType;

  const rootClassName = clsx(styles.message, styles[type], className);

  const style = color
    ? ({ "--message-background": color } as CSSProperties)
    : undefined;

  const formatter = useLocalizedStringFormatter(locales, "Message");

  const propsContext: PropsContext = {
    Content: {
      className: styles.content,
      children: dynamic((props) => {
        return (
          <>
            <div className={styles.tipBorder} aria-hidden />
            <div className={styles.tip} aria-hidden />
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
          "aria-label": formatter.format("options"),
        },
      },
      Text: { className: styles.date },
      Align: {
        wrapWith: <ClearPropsContext />,
        className: styles.user,
        Avatar: { Initials: { "aria-hidden": true } },
      },
      children: dynamic((props) => (
        <>
          <Aria.VisuallyHidden>
            {formatter.format("headerLabel")}
          </Aria.VisuallyHidden>
          {props.children}
        </>
      )),
    },

    Button: {
      size: "s",
      className: styles.action,
    },
    ActionGroup: {
      preserveOrder: true,
      className: styles.actionGroup,
      Button: {
        size: "s",
        className: styles.actionGroupAction,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <Element className={rootClassName} style={style}>
        {children}
      </Element>
    </PropsContextProvider>
  );
});

export default Message;
