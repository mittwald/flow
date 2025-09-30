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

export type ListItemViewProps = PropsWithChildren &
  Pick<ColumnLayoutProps, "s" | "m" | "l">;

export const ListItemView = (props: ListItemViewProps) => {
  const { children, s, m, l } = props;
  const list = useList();

  const propsContext: PropsContext = {
    ContextMenu: {
      tunnelId: "button",
      wrapWith: <OptionsButton className={styles.action} />,
    },
    Button: {
      tunnelId: "button",
      size: dynamic(() => (useList().viewMode === "tiles" ? "s" : "m")),
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
    <TunnelProvider>
      <ListItemViewContentView
        viewMode={list.viewMode}
        title={<TunnelExit id="title" />}
        avatar={<TunnelExit id="avatar" />}
        button={<TunnelExit id="button" />}
        subTitle={<TunnelExit id="text" />}
        bottom={<TunnelExit id="bottom" />}
        checkbox={<TunnelExit id="checkbox" />}
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
