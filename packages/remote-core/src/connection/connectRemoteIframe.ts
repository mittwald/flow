import type {
  HostExports,
  HostToRemoteConnection,
  NavigationState,
  RemoteExports,
} from "@/connection/types";
import { emptyImplementation } from "@/ext-bridge/implementation";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import type { ExtBridgeConnectionApi } from "@mittwald/ext-bridge";
import type { RemoteConnection } from "@mittwald/remote-dom-core/elements";
import { ThreadIframe } from "@quilted/threads";

interface Options {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
  onReady?: () => void;
  onError?: (error: string) => void;
  onNavigationStateChanged?: (state: NavigationState) => void;
  extBridgeImplementation?: ExtBridgeConnectionApi;
}

export const connectRemoteIframe = (opts: Options): HostToRemoteConnection => {
  const {
    connection,
    iframe,
    onReady,
    onError,
    onNavigationStateChanged,
    extBridgeImplementation = emptyImplementation,
  } = opts;

  const result = {
    thread: new ThreadIframe<RemoteExports, HostExports>(iframe, {
      serialization: new FlowThreadSerialization(),
      exports: {
        ...extBridgeImplementation,
        setIsReady: async (version = 1) => {
          result.version = version;
          onReady?.();
        },
        setError: async (error: string) => {
          onError?.(error);
        },
        setNavigationState: async (state) => {
          onNavigationStateChanged?.(state);
        },
      },
    }),
    version: 0,
  };

  result.thread.imports.render(connection);
  return result;
};

export const connectRemoteIframeRef =
  (opts: Omit<Options, "iframe">) => (ref: HTMLIFrameElement | null) => {
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
