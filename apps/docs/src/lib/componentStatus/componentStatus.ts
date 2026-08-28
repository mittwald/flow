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

const isDeprecated = (name: string | undefined): boolean =>
  (name === undefined ? undefined : getComponentStatusInfo(name)?.level) ===
  "deprecated";

/**
 * Deprecated components sort after everything else (ADR 0003 §5: "Deprecated
 * moved to the end"). The single comparator for it, because navigation and the
 * component overview must agree on order.
 */
export const compareDeprecatedLast = (
  a: string | undefined,
  b: string | undefined,
): number => Number(isDeprecated(a)) - Number(isDeprecated(b));
