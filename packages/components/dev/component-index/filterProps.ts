import type { PropItem } from "react-docgen-typescript";

/**
 * Where a prop is declared, derived from the file react-docgen-typescript
 * reports as its parent.
 *
 * - `own` — declared in Flow's own source. Always consumer API.
 * - `react-aria` — declared by react-aria / react-aria-components. Flow's
 *   behaviour API (`onPress`, `isDisabled`, `aria-label`) lives here, mixed
 *   with raw DOM passthrough (see `isConsumerProp`).
 * - `react` — inherited from `@types/react` by extending a DOM element's props.
 *   This is the HTML/SVG attribute flood: `Icon` alone picks up 486 of them,
 *   none of which is Flow API.
 * - `unknown` — anything else; kept, because guessing wrong drops real API.
 */
export type PropOrigin = "own" | "react-aria" | "react" | "unknown";

const FLOW_SOURCE = /(?:^|[\\/])components[\\/]src[\\/]/;
const REACT_TYPES = /[\\/]@types[\\/]react[\\/]/;
const REACT_ARIA =
  /[\\/](?:react-aria|react-aria-components|@react-types|@react-aria)[\\/]/;

const CAPTURE_PHASE = /Capture$/;

const DOM_PASSTHROUGH_HANDLER =
  /^on(?:Mouse|Pointer|Touch|Wheel|Animation|Transition|AuxClick|ContextMenu|DoubleClick|Scroll)/;

const LABELLING_ARIA_ATTRIBUTES = new Set([
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-hidden",
]);

export const propOrigin = (prop: PropItem): PropOrigin => {
  const fileName = prop.parent?.fileName ?? "";

  if (FLOW_SOURCE.test(fileName)) {
    return "own";
  }
  if (REACT_TYPES.test(fileName)) {
    return "react";
  }
  if (REACT_ARIA.test(fileName)) {
    return "react-aria";
  }
  return "unknown";
};

export const isConsumerProp = (name: string, prop: PropItem): boolean => {
  const origin = propOrigin(prop);
  if (origin === "own") {
    return true;
  }
  if (origin === "react") {
    return LABELLING_ARIA_ATTRIBUTES.has(name);
  }

  return (
    name.startsWith("aria-") ||
    (!CAPTURE_PHASE.test(name) && !DOM_PASSTHROUGH_HANDLER.test(name))
  );
};

export const isInternalProp = (prop: PropItem): boolean =>
  prop.description.includes("@internal");

const OPTIONAL_UNION_MEMBER = / \| (?:undefined|null)/g;

export const propType = (name: string, prop: PropItem): string =>
  name === "children"
    ? "ReactNode"
    : prop.type.name.replaceAll(OPTIONAL_UNION_MEMBER, "");
