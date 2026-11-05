import { DEFAULT_ALLOWED_HOST_ORIGINS } from "@/connection/allowedHostOrigins";
import {
  createAllowedHostOriginMatcher,
  normalizeHostOrigin,
} from "@/connection/hostOriginPatterns";
import { RemoteError } from "@/error";
import {
  Thread,
  type ThreadMessageTarget,
  type ThreadOptions,
} from "@quilted/threads";

const CHECK_MESSAGE = "quilt.threads.ping";
const RESPONSE_MESSAGE = "quilt.threads.pong";

interface HostOriginTargetOptions {
  allowedHostOrigins?: readonly string[];
}

export const hostOriginMessageTarget = (
  parent: Window,
  { allowedHostOrigins: additionalOrigins = [] }: HostOriginTargetOptions = {},
): ThreadMessageTarget => {
  const warnedOrigins = new Set<string>();
  const isAllowedHostOrigin = createAllowedHostOriginMatcher([
    ...DEFAULT_ALLOWED_HOST_ORIGINS,
    window.location.origin,
    ...additionalOrigins,
  ]);
  const ancestorOriginValue = window.location.ancestorOrigins?.[0];
  const ancestorOrigin = ancestorOriginValue
    ? normalizeHostOrigin(ancestorOriginValue)
    : undefined;

  if (
    ancestorOriginValue &&
    (!ancestorOrigin || !isAllowedHostOrigin(ancestorOrigin))
  ) {
    warnedOrigins.add(ancestorOriginValue);
    console.warn(
      `Host origin ${ancestorOriginValue} is not an allowed host origin. Add it to allowedHostOrigins to connect.`,
    );
    throw new RemoteError("Host origin is not allowed");
  }

  let hostOrigin = ancestorOrigin;
  const pendingMessages: {
    message: unknown;
    transferables?: Transferable[];
  }[] = [];

  const post = (
    message: unknown,
    origin: string,
    transferables?: Transferable[],
  ) => parent.postMessage(message, origin, transferables ?? []);

  const flush = () => {
    if (!hostOrigin) {
      return;
    }

    for (const { message, transferables } of pendingMessages.splice(0)) {
      post(message, hostOrigin, transferables);
    }
  };

  const accept = (event: MessageEvent) => {
    if (event.source !== parent) {
      return false;
    }

    if (!isAllowedHostOrigin(event.origin)) {
      if (!warnedOrigins.has(event.origin)) {
        warnedOrigins.add(event.origin);
        console.warn(
          `Ignored a message from host origin ${event.origin}: it is not an allowed host origin. Add it to allowedHostOrigins to connect.`,
        );
      }
      return false;
    }

    if (hostOrigin && event.origin !== hostOrigin) {
      if (!warnedOrigins.has(event.origin)) {
        warnedOrigins.add(event.origin);
        console.warn(
          `Ignored a message from host origin ${event.origin}: the connection uses ${hostOrigin}.`,
        );
      }
      return false;
    }

    hostOrigin ??= event.origin;
    return true;
  };

  let hasAnnouncedReady = false;
  const announceReady = () => {
    if (hasAnnouncedReady) {
      return;
    }
    hasAnnouncedReady = true;

    post(RESPONSE_MESSAGE, hostOrigin ?? "*");
  };

  if (document.readyState === "complete") {
    announceReady();
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "complete") {
        announceReady();
      }
    });
  }

  return {
    send(message, transferables) {
      if (!hostOrigin) {
        pendingMessages.push({ message, transferables });
        return;
      }

      post(message, hostOrigin, transferables);
    },
    listen(listener, { signal }) {
      window.addEventListener(
        "message",
        (event) => {
          if (!accept(event)) {
            return;
          }

          if (event.data === CHECK_MESSAGE) {
            post(RESPONSE_MESSAGE, event.origin);
            flush();
            return;
          }

          flush();
          listener(event.data);
        },
        { signal },
      );
    },
  };
};

const resolvedRemoteOrigin = (
  iframe: HTMLIFrameElement,
  remoteOrigin?: string,
) => {
  const configuredOrigin = remoteOrigin?.trim();
  const iframeSource = iframe.getAttribute("src")?.trim();

  if (!configuredOrigin && !iframeSource) {
    throw new RemoteError("Remote origin could not be determined");
  }

  try {
    const origin = configuredOrigin
      ? new URL(configuredOrigin).origin
      : new URL(iframe.src, document.baseURI).origin;

    if (origin === "null") {
      throw new RemoteError("Remote origin could not be determined");
    }

    return origin;
  } catch (error) {
    if (error instanceof RemoteError) {
      throw error;
    }
    throw new RemoteError("Remote origin could not be determined");
  }
};

export const remoteOriginMessageTarget = (
  iframe: HTMLIFrameElement,
  remoteOrigin?: string,
): ThreadMessageTarget => {
  const expectedOrigin = resolvedRemoteOrigin(iframe, remoteOrigin);
  const remoteWindow = iframe.contentWindow;

  if (!remoteWindow) {
    throw new RemoteError("Remote window could not be determined");
  }

  const warnedOrigins = new Set<string>();
  let connected = false;
  let shouldAnswerResponse = true;
  const pendingMessages: {
    message: unknown;
    transferables?: Transferable[];
  }[] = [];

  const post = (message: unknown, transferables?: Transferable[]) =>
    remoteWindow.postMessage(message, expectedOrigin, transferables ?? []);

  const accept = (event: MessageEvent) => {
    if (event.source !== remoteWindow) {
      return false;
    }

    if (event.origin !== expectedOrigin) {
      if (!warnedOrigins.has(event.origin)) {
        warnedOrigins.add(event.origin);
        console.warn(
          `Ignored a message from remote origin ${event.origin}: expected ${expectedOrigin}.`,
        );
      }
      return false;
    }

    return true;
  };

  const responseController = new AbortController();
  if (typeof iframe.addEventListener === "function") {
    iframe.addEventListener(
      "load",
      () => {
        shouldAnswerResponse = true;
      },
      { signal: responseController.signal },
    );
  }
  window.addEventListener(
    "message",
    (event) => {
      if (!accept(event) || event.data !== RESPONSE_MESSAGE) {
        return;
      }

      if (shouldAnswerResponse) {
        shouldAnswerResponse = false;
        post(CHECK_MESSAGE);
      }
      if (connected) {
        return;
      }

      connected = true;
      for (const { message, transferables } of pendingMessages.splice(0)) {
        post(message, transferables);
      }
    },
    { signal: responseController.signal },
  );
  post(CHECK_MESSAGE);

  return {
    send(message, transferables) {
      if (!connected) {
        pendingMessages.push({ message, transferables });
        return;
      }

      post(message, transferables);
    },
    listen(listener, { signal }) {
      if (signal?.aborted) {
        responseController.abort();
      } else {
        signal?.addEventListener("abort", () => responseController.abort(), {
          once: true,
        });
      }

      window.addEventListener(
        "message",
        (event) => {
          if (!accept(event) || event.data === RESPONSE_MESSAGE) {
            return;
          }

          listener(event.data);
        },
        { signal },
      );
    },
  };
};

interface HostOriginThreadOptions<Imports, Exports>
  extends ThreadOptions<Imports, Exports>, HostOriginTargetOptions {
  parent?: Window;
}

export class HostOriginThread<
  Imports = Record<string, never>,
  Exports = Record<string, never>,
> extends Thread<Imports, Exports> {
  readonly parent: Window;

  constructor({
    parent = globalThis.parent,
    allowedHostOrigins,
    ...options
  }: HostOriginThreadOptions<Imports, Exports> = {}) {
    super(hostOriginMessageTarget(parent, { allowedHostOrigins }), options);
    this.parent = parent;
  }
}

interface RemoteOriginThreadOptions<Imports, Exports> extends ThreadOptions<
  Imports,
  Exports
> {
  remoteOrigin?: string;
}

export class RemoteOriginThread<
  Imports = Record<string, never>,
  Exports = Record<string, never>,
> extends Thread<Imports, Exports> {
  readonly iframe: HTMLIFrameElement;

  constructor(
    iframe: HTMLIFrameElement,
    { remoteOrigin, ...options }: RemoteOriginThreadOptions<Imports, Exports>,
  ) {
    super(remoteOriginMessageTarget(iframe, remoteOrigin), options);
    this.iframe = iframe;
  }
}
