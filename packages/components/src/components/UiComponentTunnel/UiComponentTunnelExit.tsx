import type { FC } from "react";
import { TunnelExit, type TunnelExitProps } from "@mittwald/react-tunnel";
import { getTunnelProviderId } from "./lib";
import type { FlowComponentName } from "../propTypes";

export type UiComponentTunnelExitProps = Omit<TunnelExitProps, "providerId"> & {
  component: FlowComponentName;
};

export const UiComponentTunnelExit: FC<UiComponentTunnelExitProps> = (
  props,
) => {
  const { component, ...tunnelExitProps } = props;
  return (
    <TunnelExit
      {...tunnelExitProps}
      providerId={getTunnelProviderId(component)}
    />
  );
};
