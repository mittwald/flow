import type { TunnelEntryProps } from "@mittwald/flow-react-components";
import { TunnelEntry as FlowTunnelEntry } from "@mittwald/flow-react-components";
import { type FC } from "react";

export const TunnelEntry: FC<TunnelEntryProps> = (props) => {
  const { id, ...restProps } = props;
  // Prefix the id with '@flr-' to prevent overriding regular tunnels
  const prefixedId = `@flr-${id ?? "default"}`;
  return <FlowTunnelEntry id={prefixedId} {...restProps} />;
};

export default TunnelEntry;
