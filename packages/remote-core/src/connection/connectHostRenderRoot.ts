import type {
  HostExports,
  RemoteExports,
  RemoteToHostConnection,
} from "@/connection/types";
import { delegateExtBridgeRemoteFunctions } from "@/ext-bridge/delegateExtBridgeRemoteFunctions";
import { type RemoteConnection } from "@mfalkenberg/remote-dom-core/elements";
import { ThreadNestedIframe } from "@quilted/threads";

interface Options {
  disableExtBridge?: boolean;
}

export const connectHostRenderRoot = (
  div: HTMLDivElement,
  opts: Options = {},
): RemoteToHostConnection => {
  const { disableExtBridge = false } = opts;

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

  if (typeof mittwald.extBridge !== "undefined" && !disableExtBridge) {
    delegateExtBridgeRemoteFunctions(thread);
    mittwald.extBridge.setIsReady();
  }

  return thread;
};

export const connectHostRenderRootRef =
  (opts?: Options) => (ref: HTMLDivElement | null) => {
    if (ref === null) {
      return;
    }
    if ("__remoteConnection" in ref) {
      return ref["__remoteConnection"] as RemoteToHostConnection;
    }

    const connection = connectHostRenderRoot(ref, opts);
    Object.assign(ref, { __remoteConnection: connection });
    return connection;
  };
