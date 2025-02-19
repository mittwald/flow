import { ThreadNestedIframe } from "@quilted/threads";
import { type RemoteConnection } from "@remote-dom/core/elements";

export const connectHostIframe = (iframe: HTMLIFrameElement) => {
  new ThreadNestedIframe({
    exports: {
      render: (connection: RemoteConnection) => {
        import("@remote-dom/core/elements").then(
          ({ RemoteMutationObserver }) => {
            const observer = new RemoteMutationObserver(connection);
            observer.observe(iframe);
          },
        );
      },
    },
  });
};

export const connectHostIframeRef = (ref: HTMLIFrameElement | null) => {
  if (ref && !("__remoteConnectionEstablished" in ref)) {
    Object.assign(ref, { __remoteConnectionEstablished: true });
    connectHostIframe(ref);
  }
};
