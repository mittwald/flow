import { ThreadNestedIframe } from "@quilted/threads";
import {
  type RemoteConnection,
  RemoteMutationObserver,
} from "@remote-dom/core/elements";

export const connectHostIframe = (iframe: HTMLIFrameElement) => {
  new ThreadNestedIframe({
    exports: {
      render: (connection: RemoteConnection) => {
        const observer = new RemoteMutationObserver(connection);
        observer.observe(iframe);
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
