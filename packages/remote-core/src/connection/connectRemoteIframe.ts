import type { HostExports, RemoteExports } from "@/connection/types";
import type { RemoteConnection } from "@mfalkenberg/remote-dom-core/elements";
import {
  emptyImplementation,
  type ExtBridgeFunctions,
} from "@mittwald/ext-bridge";
import { ThreadIframe } from "@quilted/threads";

interface Opts {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
  extBridgeImplementation?: ExtBridgeFunctions;
}

export const connectRemoteIframe = (opts: Opts) => {
  const {
    connection,
    iframe,
    extBridgeImplementation = emptyImplementation,
  } = opts;

  const thread = new ThreadIframe<RemoteExports, HostExports>(iframe, {
    exports: extBridgeImplementation,
  });

  thread.imports.render(connection);
};

export const connectRemoteIframeRef =
  (
    connection: RemoteConnection,
    extBridgeImplementation?: ExtBridgeFunctions,
  ) =>
  (ref: HTMLIFrameElement | null) => {
    if (!ref) {
      return;
    }

    if ("__remoteConnectionEstablished" in ref) {
      return;
    }

    connectRemoteIframe({
      iframe: ref,
      connection,
      extBridgeImplementation,
    });
    Object.assign(ref, { __remoteConnectionEstablished: true });
  };
