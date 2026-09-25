import { remoteContextKey } from "@/composables/remoteContext";
import { isRenderedByComposition } from "@/lib/composition";
import { inject } from "vue";

/**
 * Reports that a component was rendered, so the host can tell which parts of
 * Flow an extension actually uses.
 *
 * Only what the extension wrote counts. An element one of this package's
 * compositions renders for itself — the `OverlayContent` of a `Modal`, the
 * `ItemsGridList` of a `List` — reports nothing, and the composition reports
 * its own name instead. That is what Flow's React binding reports: a
 * `flowComponent` under its name, the views it composes not at all.
 */
export const useComponentUsage = (component: string): (() => void) => {
  const context = inject(remoteContextKey, undefined);
  const isInternal = isRenderedByComposition();
  return () => {
    if (!isInternal) {
      context?.reportComponentUsage(component);
    }
  };
};
