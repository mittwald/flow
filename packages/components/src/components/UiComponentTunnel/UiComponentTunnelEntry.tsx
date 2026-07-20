import type { FC } from "react";
import { TunnelEntry, type TunnelEntryProps } from "@mittwald/react-tunnel";
import { getTunnelProviderId } from "./lib";
import type { FlowComponentName } from "@/components/propTypes";

export type UiComponentTunnelEntryProps = Omit<
  TunnelEntryProps,
  "providerId"
> & {
  component: FlowComponentName;
};

export const UiComponentTunnelEntry: FC<UiComponentTunnelEntryProps> = (
  props,
) => {
  const { component, ...tunnelEntryProps } = props;
  return (
    <TunnelEntry
      {...tunnelEntryProps}
      providerId={getTunnelProviderId(component)}
    />
  );
};
