import { Children } from "react";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

export const LinkListTunnelExit: typeof UiComponentTunnelExit = (props) => {
  return (
    <UiComponentTunnelExit
      {...props}
      children={(children) => {
        if (Children.count(children) >= 1) {
          return <ul>{children}</ul>;
        }

        return null;
      }}
    />
  );
};
