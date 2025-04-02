import type {
  HostExports,
  HostToRemoteConnection,
  RemoteExports,
} from "@/connection/types";
import { emptyImplementation } from "@/ext-bridge/implementation";
import type { RemoteConnection } from "@mittwald/remote-dom-core/elements";
import { type ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import { ThreadIframe } from "@quilted/threads";

interface Opts {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
  onReady?: () => void;
  onError?: (error: string) => void;
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

export const connectRemoteIframe = (opts: Opts): HostToRemoteConnection => {
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
        onReady?.();
      },
      setError: async (error: string) => {
        onError?.(error);
      },
    },
  });

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
