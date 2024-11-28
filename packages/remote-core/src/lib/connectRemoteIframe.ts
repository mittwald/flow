import { ThreadIframe } from "@quilted/threads";
import type { RemoteConnection } from "@remote-dom/core/elements";

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
    if (ref) {
      connectRemoteIframe({
        iframe: ref,
        connection,
      });
    }
  };
