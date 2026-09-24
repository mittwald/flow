import { Children } from "react";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import styles from "../../Navigation.module.scss";

export const LinkListTunnelExit: typeof UiComponentTunnelExit = (props) => {
  return (
    <UiComponentTunnelExit
      {...props}
      children={(children) => {
        if (Children.count(children) >= 1) {
          return <ul className={styles.linkList}>{children}</ul>;
        }

        return null;
      }}
    />
  );
};
