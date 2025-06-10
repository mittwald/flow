import { TunnelEntry as ReactTunnelEntry } from "@mittwald/react-tunnel";

export type TunnelEntryProps = typeof ReactTunnelEntry;

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const TunnelEntry: TunnelEntryProps = (props) => (
  <ReactTunnelEntry {...props} />
);

export default TunnelEntry;
