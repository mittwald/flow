import type { FlowComponentName } from "@/components/propTypes";

const tunnelProviderPrefix = "@mittwald/flow/tunnel/";

export const getTunnelProviderId = (componentName: FlowComponentName) =>
  `${tunnelProviderPrefix}${componentName}`;
