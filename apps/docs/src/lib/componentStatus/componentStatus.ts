import {
  getFlowComponentStatus,
  type FlowComponentStatus,
} from "@mittwald/flow-react-components/internal";

export type { FlowComponentStatus };

/**
 * The single seam through which the docs app reads component lifecycle status.
 * Looks up the main "." export surface and fails silently (unknown name ->
 * undefined) so a missing entry never renders a wrong badge.
 */
export const getComponentStatusInfo = (
  name: string,
): FlowComponentStatus | undefined => getFlowComponentStatus(name);
