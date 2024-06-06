import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ListItem.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/OptionsButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { LinkDOMProps } from "@react-types/shared";
import type { LinkProps } from "@/components/Link";
import { Link } from "@/components/Link";

type Props = PropsWithChildren & LinkDOMProps & Pick<LinkProps, "onPress">;

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.content
      : styles.topContent;

export const ListItem = (props: Props) => {
  const { children, href, onPress, ...linkDomProps } = props;

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
    Link: {
      unstyled: true,
    },
  };

  const MainComponent: FC<PropsWithChildren> = (props) =>
    href || onPress ? (
      <Link
        unstyled
        {...linkDomProps}
        className={styles.item}
        onPress={onPress}
        href={href}
      >
        {props.children}
      </Link>
    ) : (
      <div className={styles.item}>{props.children}</div>
    );

  return (
    <MainComponent>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          {children}
          <div className={styles.title}>
            <TunnelExit id="title" />
          </div>
          <TunnelExit id="topContent" />
        </TunnelProvider>
      </PropsContextProvider>
    </MainComponent>
  );
};

export default ListItem;
