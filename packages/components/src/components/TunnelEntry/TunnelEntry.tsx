import { TunnelEntry as ReactTunnelEntry } from "@mittwald/react-tunnel";

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const TunnelEntry: typeof ReactTunnelEntry = (props) => (
  <ReactTunnelEntry {...props} />
);

export default TunnelEntry;
