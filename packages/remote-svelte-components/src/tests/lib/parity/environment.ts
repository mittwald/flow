import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { NotificationProvider } from "@mittwald/flow-react-components";
import * as ReactRemoteComponents from "@mittwald/flow-remote-react-components";
import ReactRemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { createElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { mount, unmount } from "svelte";
import RemoteTestRoot from "../RemoteTestRoot.svelte";
import { createSerializedReceiver } from "../serializedConnection.js";
import Render from "./Render.svelte";
import type { ScenarioNode } from "./scenarios.js";

/** The same scenario, built with the generated React components. */
const toReactElement = (node: ScenarioNode, key?: number): ReactNode => {
  const Component = (ReactRemoteComponents as Record<string, unknown>)[
    node.component
  ];

  if (!Component) {
    throw new Error(
      `@mittwald/flow-remote-react-components has no "${node.component}"`,
    );
  }

  const children = (node.children ?? []).map((child, index) =>
    typeof child === "string" ? child : toReactElement(child, index),
  );

  return createElement(
    Component as never,
    { ...node.props, key },
    ...(children.length > 0 ? children : []),
  );
};

/**
 * Mounts a host next to a remote app, the way `environment.ts` does — but
 * twice, once per binding, so the two host outputs can be compared.
 */
interface ParityEnvironment {
  /** What the host rendered from the Svelte remote app. */
  svelteHost: HTMLElement;
  /** What the host rendered from the React remote app. */
  reactHost: HTMLElement;
  unmount: () => void;
}

let current: ParityEnvironment | undefined;

const hostFor = (receiver: RemoteReceiver): [HTMLElement, Root] => {
  const host = document.createElement("div");
  document.body.append(host);

  const root = createRoot(host);
  root.render(
    createElement(
      NotificationProvider,
      null,
      createElement(RemoteRenderer, { __remoteReceiver: receiver }),
    ),
  );

  return [host, root];
};

export const renderBothBindings = (node: ScenarioNode): ParityEnvironment => {
  current?.unmount();

  const svelteReceiver = new RemoteReceiver();
  const reactReceiver = new RemoteReceiver();

  const [svelteHost, svelteHostRoot] = hostFor(svelteReceiver);
  const [reactHost, reactHostRoot] = hostFor(reactReceiver);

  const svelteRemote = document.createElement("div");
  const reactRemote = document.createElement("div");
  document.body.append(svelteRemote, reactRemote);

  const svelteApp = mount(RemoteTestRoot, {
    target: svelteRemote,
    props: {
      receiver: createSerializedReceiver(svelteReceiver),
      component: Render,
      componentProps: { node },
    },
  });

  const reactApp = createRoot(reactRemote);
  reactApp.render(
    createElement(
      ReactRemoteRoot,
      { __remoteReceiver: createSerializedReceiver(reactReceiver) },
      toReactElement(node),
    ),
  );

  const environment: ParityEnvironment = {
    svelteHost,
    reactHost,
    unmount: () => {
      void unmount(svelteApp);
      reactApp.unmount();
      svelteHostRoot.unmount();
      reactHostRoot.unmount();
      svelteHost.remove();
      reactHost.remove();
      svelteRemote.remove();
      reactRemote.remove();
      current = undefined;
    },
  };

  current = environment;
  return environment;
};

export const cleanupBothBindings = (): void => current?.unmount();

/**
 * The host's output, with everything that cannot be equal between two
 * independently mounted trees taken out.
 *
 * Only generated identifiers: react-aria mints a fresh id per instance and
 * wires `for` / `aria-*` to it, so two renders of the same component never
 * agree on them. Everything else — every class, every attribute, the structure
 * itself — has to match, because the same component with the same props is
 * exactly what both bindings asked the host for.
 */
const generatedIdAttributes = [
  "id",
  "for",
  "aria-labelledby",
  "aria-describedby",
  "aria-controls",
  "aria-activedescendant",
  "aria-details",
  "data-react-aria-prevent-focus",
];

export const hostOutputOf = (host: HTMLElement): string => {
  let html = host.innerHTML;

  for (const attribute of generatedIdAttributes) {
    html = html.replaceAll(
      new RegExp(`${attribute}="[^"]*"`, "g"),
      `${attribute}="…"`,
    );
  }

  return html;
};
