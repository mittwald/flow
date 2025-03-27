import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import type { ThreadNestedIframe } from "@quilted/threads";

const fnNames = Object.keys({
  getSessionToken: true,
  getConfig: true,
} satisfies Record<keyof ExtBridgeRemoteApi, true>);

/** Delegation is required because `thread.imports` is Proxy object */
export const delegateExtBridgeRemoteFunctions = (
  thread: ThreadNestedIframe<unknown, unknown>,
) => {
  const hostExports = thread.imports as Record<string, CallableFunction>;

  const delegationEntries = fnNames.map((fn) => {
    const delegation = (...args: unknown[]) => hostExports[fn]?.(...args);
    return [fn, delegation];
  });

  Object.assign(mittwald.extBridge, Object.fromEntries(delegationEntries));
};
