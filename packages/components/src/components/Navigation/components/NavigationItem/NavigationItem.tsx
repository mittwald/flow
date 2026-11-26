import type { FC, PropsWithChildren } from "react";
import styles from "../../Navigation.module.scss";
import { UiComponentTunnelProvider } from "@/components/UiComponentTunnel/UiComponentTunnelProvider";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

/**
 * The list item around a navigation `Link`. A button must not sit inside the
 * `<a>`, so the link's `ItemAction` tunnels out to follow it here.
 */
export const NavigationItem: FC<PropsWithChildren> = (props) => (
  <li className={styles.listItem}>
    <UiComponentTunnelProvider component="Navigation">
      {props.children}
      <UiComponentTunnelExit id="itemAction" component="Navigation" />
    </UiComponentTunnelProvider>
  </li>
);
