import type { ExtBridgeFunctions } from "@mittwald/ext-bridge";
import type { ThreadNestedIframe } from "@quilted/threads";

const fnNames = Object.keys({
  getSessionToken: true,
  getContextParameters: true,
} satisfies Record<keyof ExtBridgeFunctions, true>);

/** Delegation is required because `thread.imports` is Proxy object */
export const delegateExtBridgeFunctions = (
  thread: ThreadNestedIframe<unknown, unknown>,
) => {
  const hostExports = thread.imports as Record<string, CallableFunction>;

  const delegationEntries = fnNames.map((fn) => {
    const delegation = (...args: unknown[]) => hostExports[fn]?.(...args);
    return [fn, delegation];
  });

  Object.assign(mwExtBridge, Object.fromEntries(delegationEntries));

  mwExtBridge._setIsReady();
};
