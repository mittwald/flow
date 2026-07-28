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

export interface StatusBadgeDescriptor {
  label: string;
  color: "violet" | "green" | "orange";
}

/**
 * Badges to render for a status. `level` and `isNew` are orthogonal, so a
 * beta-and-new component yields two badges. `stable` contributes no level badge.
 */
export const getStatusBadges = (
  status: FlowComponentStatus | undefined,
): StatusBadgeDescriptor[] => {
  if (!status) {
    return [];
  }

  const badges: StatusBadgeDescriptor[] = [];

  if (status.level === "beta") {
    badges.push({ label: "Beta", color: "violet" });
  }
  if (status.level === "deprecated") {
    badges.push({ label: "Veraltet", color: "orange" });
  }
  if (status.isNew) {
    badges.push({ label: "Neu", color: "green" });
  }

  return badges;
};

export interface StatusCalloutDescriptor {
  status: "info" | "warning";
  heading: string;
  body: string;
}

const BETA_CALLOUT_BODY =
  "Diese Komponente befindet sich in der Beta-Phase. Ihre API ist von der " +
  "Stabilitätsgarantie ausgenommen und kann sich auch in Minor- oder " +
  "Patch-Releases noch ändern.";

const DEPRECATED_CALLOUT_FALLBACK =
  "Diese Komponente ist veraltet und wird in einer zukünftigen Version entfernt.";

/**
 * The single callout to render for a status, or undefined. Levels are mutually
 * exclusive, so at most one callout applies; `new` has no callout.
 */
export const getStatusCallout = (
  status: FlowComponentStatus | undefined,
): StatusCalloutDescriptor | undefined => {
  if (!status) {
    return undefined;
  }

  if (status.level === "beta") {
    return { status: "info", heading: "Beta", body: BETA_CALLOUT_BODY };
  }
  if (status.level === "deprecated") {
    return {
      status: "warning",
      heading: "Veraltet",
      body: status.deprecationNotice ?? DEPRECATED_CALLOUT_FALLBACK,
    };
  }

  return undefined;
};
