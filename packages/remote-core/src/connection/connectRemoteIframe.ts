import type {
  HostExports,
  HostToRemoteConnection,
  RemoteExports,
} from "@/connection/types";
import { debug } from "@/debug";
import { emptyImplementation } from "@/ext-bridge/implementation";
import type { RemoteConnection } from "@mfalkenberg/remote-dom-core/elements";
import { type ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import { ThreadIframe } from "@quilted/threads";

const dbg = debug.extend("host");

interface Opts {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
  onReady?: () => void;
  onError?: (error: string) => void;
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

export const connectRemoteIframe = (opts: Opts): HostToRemoteConnection => {
  dbg("initialising connection");
  const {
    connection,
    iframe,
    onReady,
    onError,
    extBridgeImplementation = emptyImplementation,
  } = opts;

  const thread = new ThreadIframe<RemoteExports, HostExports>(iframe, {
    exports: {
      ...extBridgeImplementation,
      setIsReady: async () => {
        dbg(
          "connection set to ready (onReady callback: %s)",
          onReady ? "yes" : "no",
        );
        onReady?.();
      },
      setError: async (error: string) => {
        dbg(
          "received error '%s' (onError callback: %s)",
          error,
          onError ? "yes" : "no",
        );
        onError?.(error);
      },
    },
  });

  dbg("start rendering");
  thread.imports.render(connection);
  return thread;
};

export const connectRemoteIframeRef =
  (opts: Omit<Opts, "iframe">) => (ref: HTMLIFrameElement | null) => {
    if (!ref) {
      return;
    }

    if ("__remoteConnection" in ref) {
      return ref["__remoteConnection"] as HostToRemoteConnection;
    }

    const connection = connectRemoteIframe({
      iframe: ref,
      ...opts,
    });
    Object.assign(ref, { __remoteConnection: connection });
    return connection;
  };
