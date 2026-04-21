import type { FC, PropsWithChildren } from "react";
import { TunnelProvider } from "@mittwald/react-tunnel";
import { getTunnelProviderId } from "./lib";
import type { FlowComponentName } from "../propTypes";

export interface UiComponentTunnelProviderProps extends PropsWithChildren {
  component: FlowComponentName;
}

export const UiComponentTunnelProvider: FC<UiComponentTunnelProviderProps> = (
  props,
) => {
  const { children, component } = props;

  return (
    <TunnelProvider id={getTunnelProviderId(component)}>
      {children}
    </TunnelProvider>
  );
};
