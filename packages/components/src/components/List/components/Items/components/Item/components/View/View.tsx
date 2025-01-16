import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./View.module.scss";
import type { PropsContext } from "~/lib/propsContext";
import { dynamic, PropsContextProvider } from "~/lib/propsContext";
import { OptionsButton } from "~/components/List/components/Items/components/Item/components/OptionsButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { PropsWithClassName } from "~/lib/types/props";
import clsx from "clsx";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";
import { Div } from "~/components/Div";

type Props = PropsWithChildren & PropsWithClassName;

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.bottomContent
      : styles.topContent;

export const View = (props: Props) => {
  const { children, className } = props;

  const { DivView } = useViewComponents(["Div", Div]);

  const propsContext: PropsContext = {
    ContextMenu: {
      wrapWith: <OptionsButton className={styles.action} />,
      placement: "bottom end",
      tunnelId: "button",
    },
    Button: {
      className: styles.action,
      tunnelId: "button",
    },
    ActionGroup: {
      className: styles.action,
      ignoreBreakpoint: true,
      tunnelId: "button",
      Button: {
        tunnelId: null,
      },
    },
    Content: {
      className: dynamic((p) => getStyleForContentSlot(p.slot)),
    },
    Avatar: {
      className: styles.avatar,
      tunnelId: "title",
    },
    Heading: {
      className: styles.heading,
      level: 5,
      tunnelId: "title",
    },
    Text: {
      className: styles.text,
      tunnelId: "text",
    },
    Link: {
      unstyled: true,
    },
  };

  const rootClassName = clsx(styles.view, className);

  return (
    <DivView className={rootClassName}>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        <TunnelProvider>
          <DivView className={styles.content}>
            {children}
            <DivView className={styles.title}>
              <TunnelExit id="title" />
              <DivView className={styles.subTitle}>
                <TunnelExit id="text" />
              </DivView>
            </DivView>
          </DivView>
          <TunnelExit id="button" />
        </TunnelProvider>
      </PropsContextProvider>
    </DivView>
  );
};

export default View;
