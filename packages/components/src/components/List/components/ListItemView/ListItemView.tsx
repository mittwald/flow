import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./ListItemView.module.scss";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { PropsWithClassName } from "~/lib/types/props";
import ListItemViewContentView from "~/views/ListItemViewContentView";
import clsx from "clsx";
import FragmentView from "~/views/FragmentView";
import { type PropsContext, PropsContextProvider } from "~/lib/propsContext";
import { OptionsButton } from "~/components/List/components/Items/components/Item/components/OptionsButton";

export type ListItemViewProps = PropsWithChildren & PropsWithClassName;

export const ListItemView = (props: ListItemViewProps) => {
  const { children, className } = props;

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
      tunnelId: "title",
    },
    Heading: {
      tunnelId: "title",
    },
    Text: {
      tunnelId: "text",
    },
  };

  const rootClassName = clsx(styles.view, className);

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <TunnelProvider>
        <ListItemViewContentView
          title={
            <FragmentView>
              <TunnelExit id="title" />
            </FragmentView>
          }
          button={
            <FragmentView>
              <TunnelExit id="button" />
            </FragmentView>
          }
          subTitle={
            <FragmentView>
              <TunnelExit id="text" />
            </FragmentView>
          }
          className={rootClassName}
        >
          {children}
        </ListItemViewContentView>
      </TunnelProvider>
    </PropsContextProvider>
  );
};

export default ListItemView;
