import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./View.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/components/Item/components/OptionsButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { useList } from "@/components/List";

type Props = PropsWithChildren & PropsWithClassName;

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.bottomContent
      : styles.topContent;

export const View = (props: Props) => {
  const { children, className } = props;
  const list = useList();

  const showTiles = list.viewMode === "tiles";

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
      tunnelId: dynamic((p) => (p.slot === "bottom" ? p.slot : undefined)),
    },
    Avatar: {
      className: styles.avatar,
      tunnelId: "avatar",
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

  const rootClassName = clsx(styles.view, showTiles && styles.tile, className);

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        <TunnelProvider>
          {showTiles && (
            <>
              <div className={styles.avatarContainer}>
                <TunnelExit id="avatar" />
              </div>
              <div className={styles.content}>
                <div className={styles.title}>
                  <TunnelExit id="title" />
                  <div className={styles.subTitle}>
                    <TunnelExit id="text" />
                  </div>
                </div>
                <TunnelExit id="button" />
                {children}
                <TunnelExit id="bottom" />
              </div>
            </>
          )}

          {!showTiles && (
            <>
              <div className={styles.content}>
                <div className={styles.title}>
                  <TunnelExit id="avatar" />
                  <TunnelExit id="title" />
                  <div className={styles.subTitle}>
                    <TunnelExit id="text" />
                  </div>
                </div>
                {children}
              </div>
              <TunnelExit id="button" />
              <TunnelExit id="bottom" />
            </>
          )}
        </TunnelProvider>
      </PropsContextProvider>
    </div>
  );
};

export default View;
