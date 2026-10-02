import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { NotificationProvider } from "@mittwald/flow-react-components";
import * as RemoteComponents from "@mittwald/flow-remote-react-components";
import ReactRemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { createElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { mount, unmount } from "svelte";
import { expect } from "vitest";
import { commands } from "vitest/browser";
import RemoteTestRoot from "../lib/RemoteTestRoot.svelte";
import { createSerializedReceiver } from "../lib/serializedConnection.js";
import { hostSnapshot } from "./hostSnapshot.js";
import {
  prepareForSnapshot,
  rootContainer,
  setNeutralPointerPosition,
} from "./preamble.js";
import { reactToScenarioNodes } from "./reactToScenario.js";
import RemoteScenario from "./RemoteScenario.svelte";

/*
 * The visual corpus, run through the Svelte binding.
 *
 * `remote-react-components/src/tests/visual` is not copied and not ported: its
 * 84 files import their environment from `@/tests/lib/environments`, and that
 * import is redirected here by a Vite alias — the same technique the
 * cross-version harness uses to run the same corpus against old published
 * versions. The corpus is the contract; a Svelte copy of it would drift.
 *
 * A scenario is `(components) => ReactNode` and a React element is inert data,
 * so the tree is walked and rebuilt with this package's components
 * (`reactToScenario.tsx`). What is compared is the host's DOM, in two runs: the
 * React binding writes a reference per scenario, the Svelte binding reads it.
 * The references are regenerated every time and never committed — the claim is
 * "Svelte renders what React renders today", not "what React rendered once".
 *
 * Two runs rather than two trees side by side, because the corpus interacts
 * through `page.getByRole(…)`, which has to find exactly one of them.
 */
declare const __FLOW_CORPUS_MODE__: "react" | "svelte";

const mode = __FLOW_CORPUS_MODE__;

interface MountedScenario {
  unmount: () => void;
}

let mounted: MountedScenario | undefined;

const cleanup = () => {
  mounted?.unmount();
  mounted = undefined;
};

/**
 * The host on one side, the remote app on the other.
 *
 * Both runs use this layout, so the reference and the comparison are structured
 * the same. The remote tree lives outside the captured container on purpose: it
 * is a mirror of what the host renders, and inside the container it would be in
 * every snapshot and in every `getByText`.
 */
const renderScenario = (ui: ReactNode): void => {
  cleanup();

  /*
   * Converted first, and deliberately before anything is in the document: a
   * scenario the binding cannot express throws here, and a half-built
   * environment left in the DOM would make `getByTestId("root-container")`
   * ambiguous for every test after it.
   */
  const nodes = mode === "svelte" ? reactToScenarioNodes(ui) : undefined;

  const host = document.createElement("div");
  host.dataset.testid = "root-container";
  host.style.cssText =
    "width:1280px;height:720px;box-sizing:border-box;padding:32px";

  const remote = document.createElement("div");
  remote.style.cssText =
    "visibility:hidden;height:0;width:0;border:none;position:absolute;margin-left:-9999px";

  document.body.append(host, remote);

  const receiver = new RemoteReceiver();

  const hostRoot: Root = createRoot(host);
  hostRoot.render(
    createElement(
      NotificationProvider,
      null,
      createElement(RemoteRenderer, { __remoteReceiver: receiver }),
    ),
  );

  const remoteReceiver = createSerializedReceiver(receiver);

  if (mode === "react") {
    const reactRoot = createRoot(remote);
    reactRoot.render(
      createElement(ReactRemoteRoot, { __remoteReceiver: remoteReceiver }, ui),
    );

    mounted = {
      unmount: () => {
        reactRoot.unmount();
        hostRoot.unmount();
        host.remove();
        remote.remove();
      },
    };
    return;
  }

  const app = mount(RemoteTestRoot, {
    target: remote,
    props: {
      receiver: remoteReceiver,
      component: RemoteScenario,
      componentProps: { nodes },
    },
  });

  mounted = {
    unmount: () => {
      void unmount(app);
      hostRoot.unmount();
      host.remove();
      remote.remove();
    },
  };
};

const referenceKey = (description: string): string => {
  const { testPath } = expect.getState();
  const file = (testPath ?? "unknown").split("/").pop() ?? "unknown";
  return `${file.replace(/\.browser\.test\.tsx$/, "")}/${description}`;
};

/**
 * Writes the reference in the React run and compares against it in the Svelte
 * one. Same call site, so the two runs cannot diverge in when they capture.
 */
const testSnapshot = async (description: string): Promise<void> => {
  await prepareForSnapshot();

  const actual = hostSnapshot(rootContainer());
  const key = referenceKey(description);

  if (mode === "react") {
    await commands.writeCorpusReference(key, actual);
    return;
  }

  const expected = await commands.readCorpusReference(key);

  expect(
    expected,
    `No reference for "${key}". The React run has to write one first — see this package's AGENTS.md.`,
  ).not.toBeNull();

  expect(actual, `The Svelte binding rendered "${key}" differently.`).toBe(
    expected,
  );
};

const render = async (ui: ReactNode) => {
  renderScenario(ui);
  await setNeutralPointerPosition();
  return { container: rootContainer() };
};

interface CorpusEnvironment {
  toString: () => string;
  components: typeof RemoteComponents;
  render: typeof render;
  testScreenshot: (description: string) => Promise<void>;
}

const corpusEnvironment: CorpusEnvironment = {
  toString: () => (mode === "react" ? "React reference" : "Svelte"),
  components: RemoteComponents,
  render,
  testScreenshot: testSnapshot,
};

export const testEnvironments = [corpusEnvironment] as const;

export interface CrossVersionSkip {
  below?: string;
  exclude?: string[];
}

/** No old version here, so nothing is skipped — as in the normal visual suite. */
export const crossVersion = (ignoredOptions: CrossVersionSkip): boolean =>
  false;
