import type { HostExports, RemoteExports } from "@/connection/types";
import { delegateExtBridgeFunctions } from "@/lib/delegateExtBridgeFunctions";
import { type RemoteConnection } from "@mfalkenberg/remote-dom-core/elements";
import { ThreadNestedIframe } from "@quilted/threads";

export const connectHostRenderRoot = (div: HTMLDivElement) => {
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

  delegateExtBridgeFunctions(thread);
  return thread;
};

export const connectHostRenderRootRef = (ref: HTMLDivElement | null) => {
  if (ref === null || "__remoteConnectionEstablished" in ref) {
    return;
  }
  connectHostRenderRoot(ref);
  Object.assign(ref, { __remoteConnectionEstablished: true });
};
