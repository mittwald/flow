import type { ComponentDoc } from "react-docgen-typescript";
import { config } from "../remote-components-generator/config";
import { checkTagListIncludes } from "../remote-components-generator/lib/docTags";

export interface RemoteAvailability {
  available: boolean;
  excludedProps?: string[];
}

const HAND_WRITTEN_REMOTE_COMPONENTS = new Set([
  "Field",
  "Form",
  "ResetButton",
  "SubmitButton",
]);

const NOT_WORTH_REPORTING = new Set(["children", "key"]);

export const remoteAvailabilityOf = (
  component: ComponentDoc,
  flrUniversalNames: Set<string>,
  indexedPropNames: string[],
): RemoteAvailability => {
  const name = component.displayName;
  const available =
    "flr-generate" in (component.tags ?? {}) ||
    flrUniversalNames.has(name) ||
    HAND_WRITTEN_REMOTE_COMPONENTS.has(name);

  if (!available) {
    return { available: false };
  }

  const excludedProps = indexedPropNames
    .filter((prop) => !NOT_WORTH_REPORTING.has(prop))
    .filter(
      (prop) =>
        (config.ignoreProps as readonly string[]).includes(prop) ||
        checkTagListIncludes(component.tags, "ignore-props", prop),
    )
    .sort();

  return excludedProps.length > 0
    ? { available: true, excludedProps }
    : { available: true };
};
