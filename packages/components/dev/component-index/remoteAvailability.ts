import type { ComponentDoc } from "react-docgen-typescript";
import { config } from "../remote-components-generator/config";
import { checkTagListIncludes } from "../remote-components-generator/lib/docTags";

/** What the index publishes about a component's remote availability. */
export interface RemoteAvailability {
  available: boolean;
  /**
   * Props the component has locally that do not cross the remote boundary.
   * Absent when nothing is dropped.
   */
  excludedProps?: string[];
}

/**
 * Hand-written counterparts in `packages/remote-react-components` that this
 * package cannot derive: they carry no `@flr-generate` tag and are not in
 * `flr-universal`, but the remote package exports them anyway.
 *
 * `Form` from `src/components/Form.tsx`, the rest from
 * `src/integrations/react-hook-form/`. Marking them unavailable would push
 * extension developers away from the components they most need, so they are
 * listed explicitly. Keep in sync if that package gains or loses a hand-written
 * component — the derivation covers everything else.
 */
const HAND_WRITTEN_REMOTE_COMPONENTS = new Set([
  "Field",
  "Form",
  "ResetButton",
  "SubmitButton",
]);

/**
 * `children` and `key` are on the global ignore list but are not props an
 * extension developer passes: children cross as element children, and `key` is
 * React's own. Reporting them as "excluded" would read as a missing
 * capability.
 */
const NOT_WORTH_REPORTING = new Set(["children", "key"]);

/**
 * Whether a component exists on the remote side, and which of its props the
 * remote generator drops.
 *
 * Availability mirrors what `dev/remote-components-generator` actually does: a
 * component is generated iff it carries `@flr-generate` (`checkTagIsSet(tags,
 * "generate")`), and `flr-universal` is re-exported wholesale by the remote
 * package's `FlowRemoteUniversal`. Verified against the built remote package:
 * the derivation produces no false positives.
 *
 * The dropped props are the global `config.ignoreProps` plus the component's
 * own `@flr-ignore-props` — the same two steps the generator applies.
 */
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
