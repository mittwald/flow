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

/**
 * Sort rank that pushes deprecated components to the end of a list. Use it as
 * the first term of a comparator, ahead of the list's own ordering — every
 * component list in the docs ranks deprecated last, grouped or not.
 */
export const deprecationRank = (name: string | undefined): number =>
  name !== undefined && getComponentStatusInfo(name)?.level === "deprecated"
    ? 1
    : 0;
