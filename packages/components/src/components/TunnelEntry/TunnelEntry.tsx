import type { FC } from "react";
import { TunnelEntry as ReactTunnelEntry } from "@mittwald/react-tunnel";
import type { TunnelEntryProps } from "@mittwald/react-tunnel";

export type { TunnelEntryProps } from "@mittwald/react-tunnel";

/** @flr-generate all */
export const TunnelEntry: FC<TunnelEntryProps> = (props) => (
  <ReactTunnelEntry {...props} />
);

export default TunnelEntry;
