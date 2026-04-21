import type { PropsWithChildren } from "react";
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
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { listItemViewTunnelProviderId } from "./config";

export type ListItemViewProps = PropsWithChildren &
  Pick<ColumnLayoutProps, "s" | "m" | "l">;

export const ListItemView = (props: ListItemViewProps) => {
  const { children, s, m, l } = props;
  const list = useList();

  const propsContext: PropsContext = {
    ContextMenu: {
      tunnelId: "button",
      tunnelProviderId: listItemViewTunnelProviderId,
      placement: "bottom right",
      wrapWith: <OptionsButton className={styles.action} />,
    },
    Button: {
      tunnelId: "button",
      tunnelProviderId: listItemViewTunnelProviderId,
      size: dynamic(() => (useList().viewMode.isTiles ? "s" : "m")),
    },
    ActionGroup: {
      tunnelId: "button",
      tunnelProviderId: listItemViewTunnelProviderId,
      Button: {
        tunnelId: null,
        tunnelProviderId: null,
      },
    },
    Avatar: {
      tunnelId: "avatar",
      tunnelProviderId: listItemViewTunnelProviderId,
    },
    Heading: {
      tunnelId: "title",
      tunnelProviderId: listItemViewTunnelProviderId,
    },
    Text: {
      tunnelId: "text",
      tunnelProviderId: listItemViewTunnelProviderId,
    },
    Content: {
      tunnelId: dynamic((p) => (p.slot === "bottom" ? "bottom" : undefined)),
      tunnelProviderId: listItemViewTunnelProviderId,
    },
    Checkbox: {
      tunnelId: "checkbox",
      tunnelProviderId: listItemViewTunnelProviderId,
    },
  };

  return (
    <TunnelProvider id={listItemViewTunnelProviderId}>
      <ListItemViewContentView
        viewMode={list.viewMode.value}
        title={
          <TunnelExit id="title" providerId={listItemViewTunnelProviderId} />
        }
        avatar={
          <TunnelExit id="avatar" providerId={listItemViewTunnelProviderId} />
        }
        button={
          <TunnelExit id="button" providerId={listItemViewTunnelProviderId} />
        }
        subTitle={
          <TunnelExit id="text" providerId={listItemViewTunnelProviderId} />
        }
        bottom={
          <TunnelExit id="bottom" providerId={listItemViewTunnelProviderId} />
        }
        checkbox={
          <TunnelExit id="checkbox" providerId={listItemViewTunnelProviderId} />
        }
        s={s}
        m={m}
        l={l}
      >
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </ListItemViewContentView>
    </TunnelProvider>
  );
};

export default ListItemView;
