import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./ListItemView.module.scss";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import ListItemViewContentView from "@/views/ListItemViewContentView";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/components/Item/components/OptionsButton";
import { useList } from "@/components/List";

export type ListItemViewProps = PropsWithChildren;

export const ListItemView = (props: ListItemViewProps) => {
  const { children } = props;
  const list = useList();

  const propsContext: PropsContext = {
    ContextMenu: {
      tunnelId: "button",
      wrapWith: <OptionsButton className={styles.action} />,
    },
    Button: {
      tunnelId: "button",
    },
    ActionGroup: {
      tunnelId: "button",
      Button: {
        tunnelId: null,
      },
    },
    Avatar: {
      tunnelId: "avatar",
    },
    Heading: {
      tunnelId: "title",
    },
    Text: {
      tunnelId: "text",
    },
    Content: {
      tunnelId: dynamic((p) => (p.slot === "bottom" ? "bottom" : undefined)),
    },
    Checkbox: {
      tunnelId: "checkbox",
    },
  };

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <TunnelProvider>
        <ListItemViewContentView
          viewMode={list.viewMode}
          title={<TunnelExit id="title" />}
          avatar={<TunnelExit id="avatar" />}
          button={<TunnelExit id="button" />}
          subTitle={<TunnelExit id="text" />}
          bottom={<TunnelExit id="bottom" />}
          checkbox={<TunnelExit id="checkbox" />}
        >
          {children}
        </ListItemViewContentView>
      </TunnelProvider>
    </PropsContextProvider>
  );
};

export default ListItemView;
