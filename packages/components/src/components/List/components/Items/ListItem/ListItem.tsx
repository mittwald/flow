import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ListItem.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/OptionsButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { LinkDOMProps } from "@react-types/shared";
import Link from "@/components/Link";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { Button, type ButtonProps } from "@/components/Button";

type Props = PropsWithChildren &
  LinkDOMProps &
  PropsWithClassName &
  Pick<ButtonProps, "onPress">;

const getStyleForContentSlot = (slot?: string) =>
  slot === "top"
    ? styles.topContent
    : slot === "bottom"
      ? styles.content
      : styles.topContent;

export const ListItem = (props: Props) => {
  const { children, href, className, onPress, ...linkDomProps } = props;

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

  const rootClassName = clsx(styles.item, className);

  const MainComponent: FC<PropsWithChildren> = (props) =>
    href ? (
      <Link unstyled {...linkDomProps} className={rootClassName} href={href}>
        {props.children}
      </Link>
    ) : onPress ? (
      <Button unstyled className={rootClassName} onPress={onPress}>
        {props.children}
      </Button>
    ) : (
      <div className={rootClassName}>{props.children}</div>
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
