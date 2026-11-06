import { afterEach, describe, expect, test, vi } from "vitest";
import {
  hostOriginMessageTarget,
  remoteOriginMessageTarget,
} from "@/connection/originThreads";
import { RemoteError } from "@/error";

const CHECK_MESSAGE = "quilt.threads.ping";
const RESPONSE_MESSAGE = "quilt.threads.pong";

const dispatchMessage = (source: Window, origin: string, data: unknown) => {
  window.dispatchEvent(
    new MessageEvent("message", {
      source,
      origin,
      data,
    }),
  );
};

const parentWindow = () => {
  const postMessage = vi.fn();
  return {
    parent: { postMessage } as unknown as Window,
    postMessage,
  };
};

const iframeWithSource = (src: string) => {
  const postMessage = vi.fn();
  const remoteWindow = { postMessage } as unknown as Window;
  const eventTarget = new EventTarget();
  const iframe = {
    src,
    contentWindow: remoteWindow,
    getAttribute: (name: string) => (name === "src" ? src : null),
    addEventListener: eventTarget.addEventListener.bind(eventTarget),
    dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
  } as unknown as HTMLIFrameElement;

  return { iframe, remoteWindow, postMessage };
};

const setAncestorOrigins = (origins: string[] | undefined) => {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.location,
    "ancestorOrigins",
  );
  Object.defineProperty(window.location, "ancestorOrigins", {
    configurable: true,
    value: origins,
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(window.location, "ancestorOrigins", descriptor);
    } else {
      Reflect.deleteProperty(window.location, "ancestorOrigins");
    }
  };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("host origin message target", () => {
  test("accepts only the parent at an allowed origin", () => {
    const { parent } = parentWindow();
    const other = {} as Window;
    vi.spyOn(console, "warn").mockReturnValue(undefined);
    const received = vi.fn();
    const controller = new AbortController();
    const target = hostOriginMessageTarget(parent, {
      allowedHostOrigins: ["https://host.example"],
    });
    target.listen(received, { signal: controller.signal });

    dispatchMessage(other, "https://host.example", "wrong-source");
    dispatchMessage(parent, "https://other.example", "wrong-origin");
    dispatchMessage(parent, "https://host.example", "accepted");

    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith("accepted");
    controller.abort();
  });

  test("accepts a normalized additional host origin", () => {
    const { parent } = parentWindow();
    const received = vi.fn();
    const controller = new AbortController();
    const target = hostOriginMessageTarget(parent, {
      allowedHostOrigins: ["https://local.example/path"],
    });
    target.listen(received, { signal: controller.signal });

    dispatchMessage(parent, "https://local.example", "accepted");

    expect(received).toHaveBeenCalledWith("accepted");
    controller.abort();
  });

  test("accepts the remote app origin", () => {
    const { parent } = parentWindow();
    const received = vi.fn();
    const controller = new AbortController();
    const target = hostOriginMessageTarget(parent);
    target.listen(received, { signal: controller.signal });

    dispatchMessage(parent, window.location.origin, "accepted");

    expect(received).toHaveBeenCalledWith("accepted");
    controller.abort();
  });

  test("uses a wildcard target origin only for the ready response", () => {
    const { parent, postMessage } = parentWindow();
    const controller = new AbortController();
    const target = hostOriginMessageTarget(parent, {
      allowedHostOrigins: ["https://host.example"],
    });
    target.listen(vi.fn(), { signal: controller.signal });

    dispatchMessage(parent, "https://host.example", CHECK_MESSAGE);
    target.send("data");

    expect(postMessage).toHaveBeenCalled();
    expect(postMessage).toHaveBeenCalledWith(RESPONSE_MESSAGE, "*", []);
    expect(
      postMessage.mock.calls.every(
        ([message, origin]) => message === RESPONSE_MESSAGE || origin !== "*",
      ),
    ).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(
      RESPONSE_MESSAGE,
      "https://host.example",
      [],
    );
    controller.abort();
  });

  test("matches wildcard default host origins", () => {
    const { parent } = parentWindow();
    vi.spyOn(console, "warn").mockReturnValue(undefined);
    const received = vi.fn();
    const controller = new AbortController();
    const target = hostOriginMessageTarget(parent);
    target.listen(received, { signal: controller.signal });

    dispatchMessage(parent, "https://mittwald.de", "apex");
    dispatchMessage(parent, "https://othermittwald.de", "other-domain");
    dispatchMessage(parent, "https://studio.mittwald.de", "accepted");

    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith("accepted");
    controller.abort();
  });

  test("queues messages until the host origin is known", () => {
    const { parent, postMessage } = parentWindow();
    const controller = new AbortController();
    const target = hostOriginMessageTarget(parent, {
      allowedHostOrigins: ["https://host.example"],
    });
    target.listen(vi.fn(), { signal: controller.signal });
    postMessage.mockClear();

    target.send("first");
    target.send("second");
    expect(postMessage).not.toHaveBeenCalled();

    dispatchMessage(parent, "https://host.example", CHECK_MESSAGE);

    expect(postMessage.mock.calls.map(([message]) => message)).toStrictEqual([
      RESPONSE_MESSAGE,
      "first",
      "second",
    ]);
    controller.abort();
  });

  test("keeps the first accepted host origin", () => {
    const { parent } = parentWindow();
    vi.spyOn(console, "warn").mockReturnValue(undefined);
    const received = vi.fn();
    const controller = new AbortController();
    const target = hostOriginMessageTarget(parent, {
      allowedHostOrigins: ["https://first.example", "https://second.example"],
    });
    target.listen(received, { signal: controller.signal });

    dispatchMessage(parent, "https://first.example", "first");
    dispatchMessage(parent, "https://second.example", "second");

    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith("first");
    controller.abort();
  });

  test("warns once for each rejected parent origin", () => {
    const { parent } = parentWindow();
    const other = {} as Window;
    const warn = vi.spyOn(console, "warn").mockReturnValue(undefined);
    const controller = new AbortController();
    const target = hostOriginMessageTarget(parent, {
      allowedHostOrigins: ["https://first.example", "https://second.example"],
    });
    target.listen(vi.fn(), { signal: controller.signal });

    dispatchMessage(other, "https://silent.example", "foreign-source");
    dispatchMessage(parent, "https://other.example", "not-allowed");
    dispatchMessage(parent, "https://other.example", "not-allowed-again");
    dispatchMessage(parent, "https://first.example", "accepted");
    dispatchMessage(parent, "https://second.example", "different-origin");
    dispatchMessage(parent, "https://second.example", "different-origin-again");

    expect(warn.mock.calls).toStrictEqual([
      [
        "Ignored a message from host origin https://other.example: it is not an allowed host origin. Add it to allowedHostOrigins to connect.",
      ],
      [
        "Ignored a message from host origin https://second.example: the connection uses https://first.example.",
      ],
    ]);
    controller.abort();
  });

  test("warns when the ancestor origin is not allowed", () => {
    const restoreAncestorOrigins = setAncestorOrigins([
      "https://other.example",
    ]);
    const warn = vi.spyOn(console, "warn").mockReturnValue(undefined);

    try {
      expect(() => hostOriginMessageTarget(parentWindow().parent)).toThrow(
        RemoteError,
      );
      expect(warn).toHaveBeenCalledOnce();
      expect(warn).toHaveBeenCalledWith(
        "Host origin https://other.example is not an allowed host origin. Add it to allowedHostOrigins to connect.",
      );
    } finally {
      restoreAncestorOrigins();
    }
  });
});

describe("remote iframe origin message target", () => {
  test("derives the target origin from the iframe source", () => {
    const { iframe, postMessage } = iframeWithSource(
      "https://remote.example/app",
    );
    const controller = new AbortController();

    remoteOriginMessageTarget(iframe).listen(vi.fn(), {
      signal: controller.signal,
    });

    expect(postMessage).toHaveBeenCalledWith(
      CHECK_MESSAGE,
      "https://remote.example",
      [],
    );
    controller.abort();
  });

  test("warns once for each rejected iframe origin", () => {
    const { iframe, remoteWindow } = iframeWithSource(
      "https://remote.example/app",
    );
    const other = {} as Window;
    const warn = vi.spyOn(console, "warn").mockReturnValue(undefined);
    const received = vi.fn();
    const controller = new AbortController();
    const target = remoteOriginMessageTarget(iframe);
    target.listen(received, { signal: controller.signal });

    dispatchMessage(other, "https://silent.example", "foreign-source");
    dispatchMessage(remoteWindow, "https://other.example", "dropped");
    dispatchMessage(remoteWindow, "https://other.example", "dropped-again");
    dispatchMessage(remoteWindow, "https://third.example", "also-dropped");
    dispatchMessage(remoteWindow, "https://remote.example", "accepted");

    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith("accepted");
    expect(warn.mock.calls).toStrictEqual([
      [
        "Ignored a message from remote origin https://other.example: expected https://remote.example.",
      ],
      [
        "Ignored a message from remote origin https://third.example: expected https://remote.example.",
      ],
    ]);
    controller.abort();
  });

  test("bounds response checks per iframe load and flushes queued messages once", () => {
    const { iframe, remoteWindow, postMessage } = iframeWithSource(
      "https://remote.example/app",
    );
    const received = vi.fn();
    const controller = new AbortController();
    const target = remoteOriginMessageTarget(iframe);
    target.listen(received, { signal: controller.signal });
    postMessage.mockClear();

    target.send("queued");
    expect(postMessage).not.toHaveBeenCalled();

    dispatchMessage(remoteWindow, "https://remote.example", RESPONSE_MESSAGE);
    dispatchMessage(remoteWindow, "https://remote.example", RESPONSE_MESSAGE);

    expect(postMessage.mock.calls).toStrictEqual([
      [CHECK_MESSAGE, "https://remote.example", []],
      ["queued", "https://remote.example", []],
    ]);

    iframe.dispatchEvent(new Event("load"));
    dispatchMessage(remoteWindow, "https://remote.example", RESPONSE_MESSAGE);
    dispatchMessage(remoteWindow, "https://remote.example", RESPONSE_MESSAGE);

    expect(postMessage.mock.calls).toStrictEqual([
      [CHECK_MESSAGE, "https://remote.example", []],
      ["queued", "https://remote.example", []],
      [CHECK_MESSAGE, "https://remote.example", []],
    ]);
    expect(received).not.toHaveBeenCalled();
    controller.abort();
  });

  test("stops synchronous check responses for one iframe load", () => {
    const { iframe, remoteWindow, postMessage } = iframeWithSource(
      "https://remote.example/app",
    );
    const controller = new AbortController();
    postMessage.mockImplementation((message: unknown) => {
      if (message === CHECK_MESSAGE) {
        dispatchMessage(
          remoteWindow,
          "https://remote.example",
          RESPONSE_MESSAGE,
        );
      }
    });

    const target = remoteOriginMessageTarget(iframe);
    target.listen(vi.fn(), { signal: controller.signal });

    const checkCount = postMessage.mock.calls.filter(
      ([message]) => message === CHECK_MESSAGE,
    ).length;
    expect(checkCount).toBeLessThanOrEqual(2);
    controller.abort();
  });

  test("flushes a remote queue after an initial check was lost", async () => {
    const hostOrigin = "https://host.example";
    const remoteOrigin = "https://remote.example";
    let remoteLoaded = false;
    const hostController = new AbortController();
    const remoteController = new AbortController();
    const parent = {} as Window;
    const remoteWindow = {} as Window;

    const postToHost = vi.fn((message: unknown, targetOrigin: string) => {
      if (targetOrigin !== "*" && targetOrigin !== hostOrigin) {
        return;
      }
      queueMicrotask(() => {
        dispatchMessage(remoteWindow, remoteOrigin, message);
      });
    });
    const postToRemote = vi.fn((message: unknown, targetOrigin: string) => {
      if (
        !remoteLoaded ||
        (targetOrigin !== "*" && targetOrigin !== remoteOrigin)
      ) {
        return;
      }
      queueMicrotask(() => {
        dispatchMessage(parent, hostOrigin, message);
      });
    });
    Object.assign(parent, { postMessage: postToHost });
    Object.assign(remoteWindow, { postMessage: postToRemote });

    const iframe = {
      src: `${remoteOrigin}/app`,
      contentWindow: remoteWindow,
      getAttribute: (name: string) =>
        name === "src" ? `${remoteOrigin}/app` : null,
    } as unknown as HTMLIFrameElement;
    const hostTarget = remoteOriginMessageTarget(iframe);
    expect(postToRemote).toHaveBeenCalledOnce();

    remoteLoaded = true;
    const remoteTarget = (() => {
      const restoreAncestorOrigins = setAncestorOrigins(undefined);
      try {
        return hostOriginMessageTarget(parent, {
          allowedHostOrigins: [hostOrigin],
        });
      } finally {
        restoreAncestorOrigins();
      }
    })();
    const received = new Promise<unknown>((resolve) => {
      hostTarget.listen(
        (message) => {
          hostController.abort();
          remoteController.abort();
          resolve(message);
        },
        { signal: hostController.signal },
      );
    });
    remoteTarget.listen(vi.fn(), { signal: remoteController.signal });
    remoteTarget.send("setIsReady");

    await expect(received).resolves.toBe("setIsReady");
  });

  test("rejects a missing or opaque iframe source", () => {
    const missing = iframeWithSource("").iframe;
    const opaque = iframeWithSource("data:text/html,remote").iframe;

    expect(() => remoteOriginMessageTarget(missing)).toThrow(RemoteError);
    expect(() => remoteOriginMessageTarget(opaque)).toThrow(RemoteError);
  });

  test("uses a configured remote origin when the iframe source is empty", () => {
    const { iframe, postMessage } = iframeWithSource("");
    const controller = new AbortController();

    remoteOriginMessageTarget(iframe, "https://configured.example").listen(
      vi.fn(),
      { signal: controller.signal },
    );

    expect(postMessage).toHaveBeenCalledWith(
      CHECK_MESSAGE,
      "https://configured.example",
      [],
    );
    controller.abort();
  });
});
