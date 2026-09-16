import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { NotificationProvider } from "@mittwald/flow-react-components";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { mount, unmount, type Component } from "svelte";
import RemoteTestRoot from "./RemoteTestRoot.svelte";
import { createSerializedReceiver } from "./serializedConnection.js";

interface RemoteEnvironment {
  /** The host's output — what a real mStudio backoffice would show. */
  host: HTMLElement;
  unmount: () => void;
}

let current: RemoteEnvironment | undefined;

/**
 * Renders a Svelte tree as a remote app against the real React host renderer.
 *
 * Both halves live in one realm, but the connection between them is the
 * production one: mutations travel through `FlowThreadSerialization` over a
 * MessageChannel, so a value that would not survive `postMessage` fails here
 * the way it fails in an extension.
 */
export const renderRemote = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: Component<any>,
  componentProps: Record<string, unknown> = {},
): RemoteEnvironment => {
  current?.unmount();

  const host = document.createElement("div");
  const remote = document.createElement("div");
  document.body.append(host, remote);

  const receiver = new RemoteReceiver();

  const reactRoot: Root = createRoot(host);
  /*
   * A real host provides the notification container the remote fills, so this
   * one does too — without it a `Notification` reaches the host and has nowhere
   * to go.
   */
  reactRoot.render(
    createElement(
      NotificationProvider,
      null,
      createElement(RemoteRenderer, { __remoteReceiver: receiver }),
    ),
  );

  const app = mount(RemoteTestRoot, {
    target: remote,
    props: {
      receiver: createSerializedReceiver(receiver),
      component,
      componentProps,
    },
  });

  const environment: RemoteEnvironment = {
    host,
    unmount: () => {
      void unmount(app);
      reactRoot.unmount();
      host.remove();
      remote.remove();
      current = undefined;
    },
  };

  current = environment;
  return environment;
};

export const cleanupRemote = (): void => current?.unmount();

/**
 * The host's rendering of an overlay, by the class its Svelte component asked
 * for.
 *
 * Overlays are portalled out of the host container, and the remote tree is
 * mirrored into the same document — so a text query matches the `flr-*` element
 * as well, and vitest's strict mode fails on the pair. Reading the host's own
 * node is unambiguous.
 */
export const hostOverlay = (className: string): Element | null =>
  document.querySelector(`.${className}`);
