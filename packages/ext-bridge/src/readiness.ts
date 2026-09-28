import { parseConfig } from "@/config/parse";
import { ExtBridgeError } from "@/error";
import { assertBrowserEnv } from "@/lib/assertBrowserEnv";
import { controllablePromise } from "@/lib/controllablePromise";
import { extractHostConfig } from "./config/extractHostConfig";

const timeoutMs = 7500;

const [readiness, resolveReadiness] = controllablePromise();
const [timoutPromise, , rejectOnTimeout] = controllablePromise();

const startTimeout = () => {
  setTimeout(() => {
    rejectOnTimeout(
      new ExtBridgeError(`Ext Bridge not ready after ${timeoutMs}ms`),
    );
  }, timeoutMs);
  return timoutPromise;
};

export const readinessApi = {
  isReady: async () => {
    assertBrowserEnv();
    try {
      await Promise.race([readiness, startTimeout()]);
    } catch (error) {
      if (mwExtBridge.connection === undefined) {
        throw new ExtBridgeError(
          `Ext Bridge not ready after ${timeoutMs}ms: the host never connected. ` +
            "If this extension renders <RemoteRoot>, make sure initExtBridge() has run " +
            "(import '@mittwald/ext-bridge/browser') before the first render.",
        );
      }
      throw error;
    }
  },
  setIsReady: async () => {
    const config = await mwExtBridge.connection.getConfig();

    const parsedConfig = parseConfig(config);
    const hostConfig = extractHostConfig(config);
    mwExtBridge.config = {
      ...parsedConfig,
      ...hostConfig,
    };

    resolveReadiness();
  },
} as const;
