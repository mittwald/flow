import type {
  HostExports,
  RemoteExports,
  RemoteToHostConnection,
} from "@/connection/types";
import { debug } from "@/debug";
import { delegateExtBridgeRemoteFunctions } from "@/ext-bridge/delegateExtBridgeRemoteFunctions";
import { type RemoteConnection } from "@mfalkenberg/remote-dom-core/elements";
import { ThreadNestedIframe } from "@quilted/threads";

const dbg = debug.extend("remote");

export const connectHostRenderRoot = (
  div: HTMLDivElement,
): RemoteToHostConnection => {
  dbg("initialising connection");
  const thread = new ThreadNestedIframe<HostExports, RemoteExports>({
    exports: {
      render: (connection: RemoteConnection) =>
        import("@mfalkenberg/remote-dom-core/elements").then(
          ({ RemoteMutationObserver }) => {
            const observer = new RemoteMutationObserver(connection);
            dbg("start observing mutations");
            observer.observe(div);
          },
        ),
    },
  });

  dbg("setting connection to ready");
  thread.imports.setIsReady();

  if (typeof mittwald.extBridge !== "undefined") {
    dbg("setting up ExtBridge");
    delegateExtBridgeRemoteFunctions(thread);
    mittwald.extBridge.setIsReady();
  } else {
    dbg("ExtBridge not available");
  }

  return thread;
};

export const connectHostRenderRootRef = (ref: HTMLDivElement | null) => {
  if (ref === null) {
    return;
  }
  if ("__remoteConnection" in ref) {
    return ref["__remoteConnection"] as RemoteToHostConnection;
  }

  const connection = connectHostRenderRoot(ref);
  Object.assign(ref, { __remoteConnection: connection });
  return connection;
};
