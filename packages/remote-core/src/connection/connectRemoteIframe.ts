import type { HostExports, RemoteExports } from "@/connection/types";
import { emptyImplementation } from "@/ext-bridge/implementation";
import type { RemoteConnection } from "@mfalkenberg/remote-dom-core/elements";
import { type ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import { ThreadIframe } from "@quilted/threads";

interface Opts {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
  onReady?: () => void;
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

export const connectRemoteIframe = (opts: Opts) => {
  const {
    connection,
    iframe,
    onReady,
    extBridgeImplementation = emptyImplementation,
  } = opts;

  const thread = new ThreadIframe<RemoteExports, HostExports>(iframe, {
    exports: {
      ...extBridgeImplementation,
      setIsReady: async () => {
        onReady?.();
      },
    },
  });

  thread.imports.render(connection);
};

export const connectRemoteIframeRef =
  (opts: Omit<Opts, "iframe">) => (ref: HTMLIFrameElement | null) => {
    if (!ref) {
      return;
    }

    if ("__remoteConnectionEstablished" in ref) {
      return;
    }

    connectRemoteIframe({
      iframe: ref,
      ...opts,
    });
    Object.assign(ref, { __remoteConnectionEstablished: true });
  };
