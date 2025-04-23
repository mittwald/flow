import type { ComponentProps, FC } from "react";
import { TunnelEntry as ReactTunnelEntry } from "@mittwald/react-tunnel";

export type TunnelEntryProps = ComponentProps<typeof ReactTunnelEntry>;

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const TunnelEntry: FC<TunnelEntryProps> = (props) => (
  <ReactTunnelEntry {...props} />
);

export default TunnelEntry;
