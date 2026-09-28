import { parseConfig } from "@/config/parse";
import { ExtBridgeError } from "@/error";
import { assertBrowserEnv } from "@/lib/assertBrowserEnv";
import { controllablePromise } from "@/lib/controllablePromise";
import { extractHostConfig } from "./config/extractHostConfig";

const timeoutMs = 7500;

const [readiness, resolveReadiness] = controllablePromise();

export const readinessApi = {
  isReady: async () => {
    assertBrowserEnv();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        readiness,
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(
              new ExtBridgeError(`Ext Bridge not ready after ${timeoutMs}ms`),
            );
          }, timeoutMs);
        }),
      ]);
    } catch (error) {
      if (mwExtBridge.connection === undefined) {
        throw new ExtBridgeError(
          `Ext Bridge not ready after ${timeoutMs}ms: the host never connected. ` +
            "If this extension renders <RemoteRoot>, make sure initExtBridge() has run " +
            "(import '@mittwald/ext-bridge/browser') before the first render.",
        );
      }
      throw error;
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
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
