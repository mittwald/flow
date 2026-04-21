import type { FlowComponentName } from "../propTypes";

const tunnelProviderPrefix = "@mittwald/flow/tunnel/";

export const getTunnelProviderId = (componentName: FlowComponentName) =>
  `${tunnelProviderPrefix}${componentName}`;
