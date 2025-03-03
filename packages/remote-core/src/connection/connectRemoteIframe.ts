import { ThreadIframe } from "@quilted/threads";
import type { RemoteConnection } from "@remote-dom/core/elements";

export type HostData = Record<string, unknown>;

interface Opts {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
}

interface ThreadIframeTarget {
  render: (connection: RemoteConnection) => AsyncIterator<unknown>;
}

export const connectRemoteIframe = (opts: Opts) => {
  const thread = new ThreadIframe<ThreadIframeTarget>(opts.iframe);
  thread.imports.render(opts.connection);
  return thread;
};

export const connectRemoteIframeRef =
  (connection: RemoteConnection) => (ref: HTMLIFrameElement | null) => {
    if (!ref) {
      return;
    }

    if ("__remoteConnectionEstablished" in ref) {
      return;
    }

    connectRemoteIframe({
      iframe: ref,
      connection,
    });
    Object.assign(ref, { __remoteConnectionEstablished: true });
  };
