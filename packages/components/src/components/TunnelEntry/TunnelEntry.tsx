import { TunnelEntry as ReactTunnelEntry } from "@mittwald/react-tunnel";
import type { TunnelEntryProps as ReactTunnelEntryProps } from "@mittwald/react-tunnel/types";
import type { FC } from "react";

export type TunnelEntryProps = ReactTunnelEntryProps;

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const TunnelEntry: FC<ReactTunnelEntryProps> = (props) => (
  <ReactTunnelEntry {...props} />
);

export default TunnelEntry;
