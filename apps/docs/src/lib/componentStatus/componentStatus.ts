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
 * A `level` (Beta/Veraltet) renders as an `AlertBadge` carrying the matching
 * status; `Neu` renders as a violet `Badge`.
 */
export type StatusBadgeDescriptor =
  | { variant: "alert"; status: "info" | "warning"; label: string }
  | { variant: "badge"; color: "violet"; label: string };

/**
 * The single badge to render for a status. The `level` badge takes precedence
 * over the `new` flag: a beta-and-new (or deprecated-and-new) component shows
 * only its level badge. `Neu` shows only when the level is `stable`. `stable`
 * without `new` yields no badge. Returns an array (0 or 1) so the caller can
 * render uniformly.
 */
export const getStatusBadges = (
  status: FlowComponentStatus | undefined,
): StatusBadgeDescriptor[] => {
  if (!status) {
    return [];
  }

  if (status.level === "beta") {
    return [{ variant: "alert", status: "info", label: "Beta" }];
  }
  if (status.level === "deprecated") {
    return [{ variant: "alert", status: "warning", label: "Veraltet" }];
  }
  if (status.isNew) {
    return [{ variant: "badge", color: "violet", label: "Neu" }];
  }

  return [];
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
