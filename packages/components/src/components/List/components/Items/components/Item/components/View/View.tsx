import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./View.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/components/Item/components/OptionsButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type {
  PropsWithClassName,
  PropsWithContainerBreakpointSize,
} from "@/lib/types/props";
import clsx from "clsx";
import { getContainerBreakpointSizeClassName } from "@/lib/getContainerBreakpointSizeClassName";

type Props = PropsWithChildren &
  PropsWithClassName &
  PropsWithContainerBreakpointSize;

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.content
      : styles.topContent;

export const View = (props: Props) => {
  const { children, className, containerBreakpointSize = "m" } = props;

  const propsContext: PropsContext = {
    ContextMenu: {
      wrapWith: <OptionsButton className={styles.action} />,
      placement: "bottom end",
    },
    Button: {
      className: styles.action,
    },
    Content: {
      className: dynamic((p) => getStyleForContentSlot(p.slot)),
      tunnelId: "topContent",
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
      tunnelId: "title",
    },
    Link: {
      unstyled: true,
    },
  };

  const rootClassName = clsx(
    styles.view,
    className,
    styles[getContainerBreakpointSizeClassName(containerBreakpointSize)],
  );

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          {children}
          <div className={styles.title}>
            <TunnelExit id="title" />
          </div>
          <TunnelExit id="topContent" />
        </TunnelProvider>
      </PropsContextProvider>
    </div>
  );
};

export default View;
