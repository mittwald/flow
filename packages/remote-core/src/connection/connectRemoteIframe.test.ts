import { afterEach, expect, test, vi } from "vitest";
import { connectRemoteIframe } from "@/connection/connectRemoteIframe";
import { RemoteOriginThread } from "@/connection/originThreads";
import { Version } from "@/connection/types";
import { RemoteError } from "@/error";
import type { HostConfig } from "@mittwald/ext-bridge";
import type { RemoteConnection } from "@mittwald/remote-dom-core/elements";

const RESPONSE_MESSAGE = "quilt.threads.pong";

const iframeWithSource = (src = "https://remote.example/app") => {
  const postMessage = vi.fn();
  const remoteWindow = { postMessage } as unknown as Window;
  const iframe = {
    src,
    contentWindow: remoteWindow,
    getAttribute: (name: string) => (name === "src" ? src : null),
  } as unknown as HTMLIFrameElement;

  return { iframe, remoteWindow };
};

const dispatchReady = (remoteWindow: Window) => {
  window.dispatchEvent(
    new MessageEvent("message", {
      source: remoteWindow,
      origin: "https://remote.example",
      data: RESPONSE_MESSAGE,
    }),
  );
};

const options = (iframe: HTMLIFrameElement) => ({
  connection: {} as RemoteConnection,
  iframe,
  hostConfig: {} as HostConfig,
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("defers rendering and host exports until the required version", async () => {
  const { iframe, remoteWindow } = iframeWithSource();
  const render = vi
    .spyOn(RemoteOriginThread.prototype, "call")
    .mockResolvedValue(undefined);
  const result = connectRemoteIframe({
    ...options(iframe),
    minRemoteVersion: Version.v6,
  });

  expect(render).not.toHaveBeenCalled();
  await expect(result.thread.exports.getHostConfig()).rejects.toThrow(
    RemoteError,
  );

  await result.thread.exports.setIsReady({ version: Version.v6 });

  expect(render).toHaveBeenCalledOnce();
  expect(result.version).toBe(Version.v6);
  await expect(result.thread.exports.getHostConfig()).resolves.toStrictEqual(
    {},
  );
  dispatchReady(remoteWindow);
  result.thread.close();
});

test("reports a remote version below the required version", async () => {
  const { iframe, remoteWindow } = iframeWithSource();
  const render = vi
    .spyOn(RemoteOriginThread.prototype, "call")
    .mockResolvedValue(undefined);
  const onReady = vi.fn();
  const onError = vi.fn();
  const result = connectRemoteIframe({
    ...options(iframe),
    minRemoteVersion: Version.v6,
    onReady,
    onError,
  });

  await result.thread.exports.setIsReady({ version: Version.v5 });

  expect(render).not.toHaveBeenCalled();
  expect(onReady).not.toHaveBeenCalled();
  expect(onError).toHaveBeenCalledWith(
    "Remote version 5 is lower than the required version 6",
  );
  dispatchReady(remoteWindow);
  result.thread.close();
});

test("renders once after a qualifying ready event", async () => {
  const { iframe, remoteWindow } = iframeWithSource();
  const order: string[] = [];
  const render = vi
    .spyOn(RemoteOriginThread.prototype, "call")
    .mockImplementation(async () => {
      order.push("render");
    });
  const result = connectRemoteIframe({
    ...options(iframe),
    minRemoteVersion: Version.v6,
    onReady: () => order.push("ready"),
  });

  await result.thread.exports.setIsReady({ version: Version.v6 });
  await result.thread.exports.setIsReady({ version: Version.v6 });

  expect(render).toHaveBeenCalledOnce();
  expect(order.slice(0, 2)).toStrictEqual(["ready", "render"]);
  dispatchReady(remoteWindow);
  result.thread.close();
});

test("renders immediately when no minimum version is configured", async () => {
  const { iframe, remoteWindow } = iframeWithSource();
  const render = vi
    .spyOn(RemoteOriginThread.prototype, "call")
    .mockResolvedValue(undefined);
  const result = connectRemoteIframe(options(iframe));

  expect(render).toHaveBeenCalledOnce();
  await expect(result.thread.exports.getHostConfig()).resolves.toStrictEqual(
    {},
  );
  dispatchReady(remoteWindow);
  result.thread.close();
});
