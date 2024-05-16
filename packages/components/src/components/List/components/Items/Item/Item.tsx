import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Item.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Wrap } from "@/components/Wrap";
import { deepHas } from "@/lib/react/deepHas";
import { Link } from "@/components/Link";
import { OptionsButton } from "@/components/List/components/Items/OptionsButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

type Props = PropsWithChildren;

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.content
      : styles.topContent;

export const Item = (props: Props) => {
  const { children } = props;

  const hasLink = deepHas(children, Link);

  const mainPropsContext: PropsContext = {
    ContextMenu: {
      render: (ContextMenu, props) => (
        <OptionsButton className={styles.action}>
          <ContextMenu {...props} placement="bottom end" />
        </OptionsButton>
      ),
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
      level: 4,
      tunnelId: "title",
    },
    Text: {
      className: styles.text,
      tunnelId: "title",
    },
    StatusBadge: {
      className: styles.statusBadge,
      tunnelId: "title",
    },
  };

  const propsContext: PropsContext = {
    ...mainPropsContext,
    Link: {
      className: styles.item,
      unstyled: true,
      ...mainPropsContext,
    },
  };

  return (
    <Wrap if={!hasLink}>
      <div className={styles.item}>
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
    </Wrap>
  );
};

export default Item;
