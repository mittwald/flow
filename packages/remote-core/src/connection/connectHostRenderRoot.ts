import type {
  HostExports,
  RemoteExports,
  RemoteToHostConnection,
} from "@/connection/types";
import { delegateExtBridgeRemoteFunctions } from "@/ext-bridge/delegateExtBridgeRemoteFunctions";
import type { RemoteConnection } from "@mfalkenberg/remote-dom-core/elements";
import { ThreadNestedIframe } from "@quilted/threads";

export const connectHostRenderRoot = (
  div: HTMLDivElement,
): RemoteToHostConnection => {
  const thread = new ThreadNestedIframe<HostExports, RemoteExports>({
    exports: {
      render: (connection: RemoteConnection) =>
        import("@mfalkenberg/remote-dom-core/elements").then(
          ({ RemoteMutationObserver }) => {
            const observer = new RemoteMutationObserver(connection);
            observer.observe(div);
          },
        ),
    },
  });

  thread.imports.setIsReady();

  if (typeof mwExtBridge !== "undefined") {
    delegateExtBridgeRemoteFunctions(thread);
    mwExtBridge.setIsReady();
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
