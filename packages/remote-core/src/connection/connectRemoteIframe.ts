import type {
  HostExports,
  HostToRemoteConnection,
  RemoteExports,
} from "@/connection/types";
import { emptyImplementation } from "@/ext-bridge/implementation";
import type { ExtBridgeConnectionApi } from "@mittwald/ext-bridge";
import type { RemoteConnection } from "@mittwald/remote-dom-core/elements";
import { ThreadIframe } from "@quilted/threads";

interface Opts {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
  onReady?: () => void;
  onError?: (error: string) => void;
  onPathnameChanged?: (url: string) => void;
  extBridgeImplementation?: ExtBridgeConnectionApi;
}

export const connectRemoteIframe = (opts: Opts): HostToRemoteConnection => {
  const {
    connection,
    iframe,
    onReady,
    onError,
    onPathnameChanged,
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
      setPathname: async (pathname: string) => {
        onPathnameChanged?.(pathname);
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
