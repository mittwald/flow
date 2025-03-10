import { type RemoteConnection } from "@mfalkenberg/remote-dom-core/elements";
import { ThreadNestedIframe } from "@quilted/threads";

export const connectHostRenderRoot = (div: HTMLDivElement) => {
  return new ThreadNestedIframe({
    exports: {
      render: (connection: RemoteConnection) => {
        import("@mfalkenberg/remote-dom-core/elements").then(
          ({ RemoteMutationObserver }) => {
            const observer = new RemoteMutationObserver(connection);
            observer.observe(div);
          },
        );
      },
    },
  });
};

export const connectHostRenderRootRef = (ref: HTMLDivElement | null) => {
  if (ref === null || "__remoteConnectionEstablished" in ref) {
    return;
  }
  connectHostRenderRoot(ref);
  Object.assign(ref, { __remoteConnectionEstablished: true });
};
