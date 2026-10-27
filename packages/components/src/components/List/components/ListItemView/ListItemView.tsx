import type { PropsWithChildren } from "react";
import styles from "./ListItemView.module.scss";
import ListItemViewContentView from "@/views/ListItemViewContentView";
import {
  dynamic,
  overlayTriggersTunneledTo,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/components/Item/components/OptionsButton";
import { useListSelector } from "@/components/List/hooks/useListSelector";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

/*
 * Built once per view mode: a new object on every render would hand every item
 * a new props context and re-render its content.
 */
const buttonTunnel = {
  id: "button",
  component: "ListItemView",
} as const;

const buildPropsContext = (buttonSize: "s" | "m"): PropsContext => ({
  ...overlayTriggersTunneledTo(buttonTunnel),
  ContextMenu: {
    tunnel: buttonTunnel,
    placement: "bottom right",
    wrapWith: <OptionsButton className={styles.action} />,
  },
  Button: {
    tunnel: buttonTunnel,
    size: buttonSize,
  },
  ActionGroup: {
    tunnel: buttonTunnel,
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
});

const listPropsContext = buildPropsContext("m");
const tilesPropsContext = buildPropsContext("s");

export type ListItemViewProps = PropsWithChildren &
  Pick<ColumnLayoutProps, "s" | "m" | "l">;

export const ListItemView = flowComponent(
  "ListItemView",
  (props: ListItemViewProps) => {
    const { children, s, m, l } = props;
    const viewMode = useListSelector((list) => list.viewMode.value);
    const propsContext =
      viewMode === "tiles" ? tilesPropsContext : listPropsContext;

    return (
      <ListItemViewContentView
        viewMode={viewMode}
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
