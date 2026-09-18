import { remoteContextKey } from "@/composables/remoteContext";
import { inject } from "vue";

/**
 * Reports that a component was rendered, so the host can tell which parts of
 * Flow an extension actually uses.
 *
 * The React package splits this between `flowComponent` and
 * `createFlowRemoteComponent`; here every component goes through one factory,
 * so one call site covers the whole surface.
 */
export const useComponentUsage = (component: string): (() => void) => {
  const context = inject(remoteContextKey, undefined);
  return () => context?.reportComponentUsage(component);
};
