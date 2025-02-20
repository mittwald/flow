import { ThreadNestedIframe } from "@quilted/threads";
import { type RemoteConnection } from "@remote-dom/core/elements";

export const connectHostRenderRoot = (div: HTMLDivElement) => {
  return new ThreadNestedIframe({
    exports: {
      receiveData: (data: unknown) => {
        window.dispatchEvent(
          new CustomEvent("flr-data-received", {
            detail: data,
          }),
        );
      },
      render: (connection: RemoteConnection) => {
        import("@remote-dom/core/elements").then(
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
