import type { PropsWithChildren } from "react";
import styles from "./ListItemView.module.scss";
import ListItemViewContentView from "@/views/ListItemViewContentView";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/components/Item/components/OptionsButton";
import { useList } from "@/components/List";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

export type ListItemViewProps = PropsWithChildren &
  Pick<ColumnLayoutProps, "s" | "m" | "l">;

export const ListItemView = flowComponent(
  "ListItemView",
  (props: ListItemViewProps) => {
    const { children, s, m, l } = props;
    const list = useList();

    const propsContext: PropsContext = {
      ContextMenu: {
        tunnel: {
          id: "button",
          component: "ListItemView",
        },
        placement: "bottom right",
        wrapWith: <OptionsButton className={styles.action} />,
      },
      Button: {
        tunnel: {
          id: "button",
          component: "ListItemView",
        },
        size: dynamic(() => (useList().viewMode.isTiles ? "s" : "m")),
      },
      ActionGroup: {
        tunnel: {
          id: "button",
          component: "ListItemView",
        },
        Button: {
          tunnel: null,
        },
      },
      Avatar: {
        tunnel: {
          id: "avatar",
          component: "ListItemView",
        },
      },
      Heading: {
        tunnel: {
          id: "title",
          component: "ListItemView",
        },
      },
      Text: {
        tunnel: {
          id: "text",
          component: "ListItemView",
        },
      },
      Content: {
        tunnel: dynamic((p) =>
          p.slot === "bottom"
            ? {
                id: "bottom",
                component: "ListItemView",
              }
            : undefined,
        ),
      },
      Checkbox: {
        tunnel: {
          id: "checkbox",
          component: "ListItemView",
        },
      },
    };

    return (
      <ListItemViewContentView
        viewMode={list.viewMode.value}
        title={<UiComponentTunnelExit id="title" component="ListItemView" />}
        avatar={<UiComponentTunnelExit id="avatar" component="ListItemView" />}
        button={<UiComponentTunnelExit id="button" component="ListItemView" />}
        subTitle={<UiComponentTunnelExit id="text" component="ListItemView" />}
        bottom={<UiComponentTunnelExit id="bottom" component="ListItemView" />}
        checkbox={
          <UiComponentTunnelExit id="checkbox" component="ListItemView" />
        }
        s={s}
        m={m}
        l={l}
      >
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </ListItemViewContentView>
    );
  },
  {
    type: "layout",
  },
);

export default ListItemView;
