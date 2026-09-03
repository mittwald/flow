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
    await Promise.race([readiness, startTimeout()]);
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
