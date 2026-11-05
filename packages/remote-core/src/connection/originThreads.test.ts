import { describe, expect, test, vi } from "vitest";
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
  const iframe = {
    src,
    contentWindow: remoteWindow,
    getAttribute: (name: string) => (name === "src" ? src : null),
  } as unknown as HTMLIFrameElement;

  return { iframe, remoteWindow, postMessage };
};

describe("host origin message target", () => {
  test("accepts only the parent at an allowed origin", () => {
    const { parent } = parentWindow();
    const other = {} as Window;
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
});

describe("remote iframe origin message target", () => {
  test("derives the target origin from the iframe source", () => {
    const { iframe, postMessage } = iframeWithSource(
      "https://remote.example/app",
    );

    remoteOriginMessageTarget(iframe);

    expect(postMessage).toHaveBeenCalledWith(
      CHECK_MESSAGE,
      "https://remote.example",
      [],
    );
  });

  test("drops messages from the iframe window at another origin", () => {
    const { iframe, remoteWindow } = iframeWithSource(
      "https://remote.example/app",
    );
    const received = vi.fn();
    const controller = new AbortController();
    const target = remoteOriginMessageTarget(iframe);
    target.listen(received, { signal: controller.signal });

    dispatchMessage(remoteWindow, "https://other.example", "dropped");
    dispatchMessage(remoteWindow, "https://remote.example", "accepted");

    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith("accepted");
    dispatchMessage(remoteWindow, "https://remote.example", RESPONSE_MESSAGE);
    controller.abort();
  });

  test("flushes queued messages to the exact remote origin", () => {
    const { iframe, remoteWindow, postMessage } = iframeWithSource(
      "https://remote.example/app",
    );
    const target = remoteOriginMessageTarget(iframe);
    postMessage.mockClear();

    target.send("queued");
    expect(postMessage).not.toHaveBeenCalled();

    dispatchMessage(remoteWindow, "https://remote.example", RESPONSE_MESSAGE);

    expect(postMessage).toHaveBeenCalledWith(
      "queued",
      "https://remote.example",
      [],
    );
  });

  test("rejects a missing or opaque iframe source", () => {
    const missing = iframeWithSource("").iframe;
    const opaque = iframeWithSource("data:text/html,remote").iframe;

    expect(() => remoteOriginMessageTarget(missing)).toThrow(RemoteError);
    expect(() => remoteOriginMessageTarget(opaque)).toThrow(RemoteError);
  });

  test("uses a configured remote origin when the iframe source is empty", () => {
    const { iframe, postMessage } = iframeWithSource("");

    remoteOriginMessageTarget(iframe, "https://configured.example");

    expect(postMessage).toHaveBeenCalledWith(
      CHECK_MESSAGE,
      "https://configured.example",
      [],
    );
  });
});
