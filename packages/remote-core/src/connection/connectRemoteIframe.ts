import { ThreadIframe } from "@quilted/threads";
import type { RemoteConnection } from "@remote-dom/core/elements";

interface Opts {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
}

interface ThreadIframeTarget {
  render: (connection: RemoteConnection) => AsyncIterator<unknown>;
  receiveData: (data: unknown) => void;
}

export const connectRemoteIframe = (opts: Opts) => {
  const thread = new ThreadIframe<ThreadIframeTarget>(opts.iframe);
  thread.imports.render(opts.connection);
  return thread;
};

export const connectRemoteIframeRef =
  (connection: RemoteConnection) =>
  (ref: HTMLIFrameElement): ThreadIframeTarget => {
    if ("__remoteConnection" in ref) {
      return ref.__remoteConnection as ThreadIframeTarget;
    }

    const thread = connectRemoteIframe({
      iframe: ref,
      connection,
    });

    Object.assign(ref, { __remoteConnection: thread.imports });
    return thread.imports;
  };
