import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./ListItemView.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/components/Item/components/OptionsButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";

export type ListItemViewProps = PropsWithChildren & PropsWithClassName;

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.bottomContent
      : styles.topContent;

/** @flr-generate all */
export const ListItemView = (props: ListItemViewProps) => {
  const { children, className } = props;

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
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        <TunnelProvider>
          <div className={styles.content}>
            {children}
            <div className={styles.title}>
              <TunnelExit id="title" />
              <div className={styles.subTitle}>
                <TunnelExit id="text" />
              </div>
            </div>
          </div>
          <TunnelExit id="button" />
        </TunnelProvider>
      </PropsContextProvider>
    </div>
  );
};

export default ListItemView;
