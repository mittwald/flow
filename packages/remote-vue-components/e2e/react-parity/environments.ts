import { hostHtml } from "./hostHtml";
import { divergenceReasonFor } from "./knownGaps";
import { toVNode } from "./reactToVue";
import { createSerializedReceiver } from "./serializedConnection";
/*
 * A relative path, not `@/`: that alias means this package's `src` to
 * TypeScript and the React package's to the harness's vite config. Spelling it
 * out is what lets the harness be typechecked at all.
 */
import {
  RootContainer,
  rootContainerLocator,
} from "../../../remote-react-components/src/tests/lib/RootContainer";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import * as ReactComponents from "@mittwald/flow-remote-react-components";
import ReactRemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import VueRemoteRoot from "@mittwald/flow-remote-vue-components/RemoteRoot";
import { createElement, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { expect } from "vitest";
import { createApp, h, type App } from "vue";

declare const __PARITY_MODE__: "reference" | "compare";
declare const __PARITY_REF_DIR__: string;

/**
 * Renders the visual corpus twice — once from React, once from Vue — and
 * asserts the host built the same tree both times.
 *
 * The scenarios are reused unmodified: this module is aliased in place of
 * `@/tests/lib/environments`, the same way the cross-version harness swaps in
 * its own. That is what makes the corpus the contract rather than a Vue-shaped
 * copy of it.
 *
 * Two runs, not two trees side by side: the reused tests locate what they
 * interact with through `page.getByRole(…)`, which must find exactly one. The
 * reference run writes a file snapshot per scenario, the Vue run compares.
 * Nothing is committed — the references are rebuilt from React every time, so
 * they cannot drift into a second source of truth.
 */
const isReference = __PARITY_MODE__ === "reference";

export { rootContainerLocator };

interface Mounted {
  host: HTMLElement;
  unmount: () => void;
}

let mounted: Mounted | undefined;

/** The host half: a React renderer fed by a receiver, as mStudio runs it. */
const mountHost = (): { receiver: RemoteReceiver; remote: HTMLDivElement } => {
  mounted?.unmount();

  const host = document.createElement("div");
  const remote = document.createElement("div");
  document.body.append(host, remote);

  const receiver = new RemoteReceiver();
  const reactRoot: Root = createRoot(host);
  /*
   * The corpus's own container: it carries the `root-container` test id the
   * reused tests locate, the 1280x720 box they were written against, and the
   * host's notification provider.
   */
  reactRoot.render(
    createElement(
      RootContainer,
      null,
      createElement(RemoteRenderer, { __remoteReceiver: receiver }),
    ),
  );

  /*
   * The remote half is torn down by removing its container: both roots live
   * only for one scenario, and the next one mounts its own pair.
   */
  mounted = {
    host,
    unmount: () => {
      reactRoot.unmount();
      host.remove();
      remote.remove();
      mounted = undefined;
    },
  };

  return { receiver, remote };
};

const renderReference = (ui: ReactElement): void => {
  const { receiver, remote } = mountHost();
  createRoot(remote).render(
    createElement(
      ReactRemoteRoot,
      { __remoteReceiver: createSerializedReceiver(receiver) },
      createElement(ReactComponents.NotificationProvider, null, ui),
    ),
  );
};

const renderVue = (ui: ReactElement): void => {
  const { receiver, remote } = mountHost();

  /*
   * Converted once before mounting, only to let the conversion fail out here.
   * Inside Vue's render the same error is caught by `RemoteRoot`'s
   * `onErrorCaptured` and forwarded to the host as a connection error — the
   * scenario then simply renders nothing, and the harness reports a timeout
   * instead of the component it could not map.
   */
  toVNode(ui);

  const app: App = createApp({
    render: () =>
      h(
        VueRemoteRoot,
        { __remoteReceiver: createSerializedReceiver(receiver) },
        { default: () => toVNode(ui) },
      ),
  });
  app.mount(remote);
};

/*
 * Markers the host leaves on the DOM while an asynchronous job of its own is
 * still in flight.
 *
 * Stable is not the same as settled: the output stops changing *while* one is
 * pending, so the sampling below can settle on a state that is on its way out.
 * `PasswordCreationField` validates its (empty) value against the policy on
 * mount and holds the complexity indicator in `--loading` until that resolves —
 * a few hundred milliseconds locally, longer on a loaded runner. Each pass then
 * gets its own coin flip, and the diff is a class that nothing in the remote
 * tree decides.
 *
 * Waited out rather than normalized away, so a marker that never clears still
 * reaches the comparison: the read falls back to the last sample, both passes
 * carry it, and a real difference underneath it still fails.
 */
const pendingMarkers = ["complexity-indicator--loading"];

const isSettled = (html: string): boolean =>
  pendingMarkers.every((marker) => !html.includes(marker));

/**
 * The host materialises the tree a round trip after `render` returns, and an
 * overlay can duplicate the DOM for a frame while it measures — so read until
 * the output stops changing rather than once.
 */
const readStableHtml = async (
  stableReads = 4,
  intervalMs = 50,
  maxSamples = 80,
): Promise<string> => {
  /*
   * The corpus's container, not the React root's wrapper: its box and test id
   * are part of what the scenarios were written against, and comparing the
   * wrapper would fold the harness's own markup into the assertion.
   */
  const read = () => {
    const container = mounted?.host.querySelector(
      "[data-testid='root-container']",
    );
    return container ? hostHtml(container) : "";
  };
  let previous = read();
  let consecutive = 1;

  for (let sample = 0; sample < maxSamples; sample++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    const next = read();
    if (next === previous) {
      consecutive += 1;
      if (consecutive >= stableReads && next.length > 0 && isSettled(next)) {
        return next;
      }
    } else {
      consecutive = 1;
      previous = next;
    }
  }

  return previous;
};

/*
 * Parks the pointer where it cannot hover anything — inside the container's
 * 32px padding — and takes the focus off whatever had it. Both passes render
 * into the same page, one after the other, so a pointer left on a control by
 * the previous scenario puts `data-hovered` on one side and not the other. The
 * visual suite parks it for the same reason before every screenshot.
 */
const setNeutralPointerPosition = async (): Promise<void> => {
  await rootContainerLocator.hover({ position: { x: 4, y: 4 }, force: true });
  rootContainerLocator.element().focus();
};

const slugify = (value: string): string =>
  value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

/*
 * Keyed by the source file as well as the test name: two reused tests in
 * different files share a name often enough (`Checkbox edge cases` exists in
 * both Checkbox and CheckboxButton), and without the file scope they would
 * share one reference — whichever wrote it last deciding the other's verdict.
 */
const referencePathFor = (description: string): string => {
  const state = expect.getState();
  const file = (state.testPath ?? "unknown").split(/[/\\]/).pop() ?? "unknown";
  const name = state.currentTestName ?? description;
  return `${__PARITY_REF_DIR__}/${slugify(`${file}-${name}-${description}`)}.html`;
};

const currentTestName = (): string =>
  expect.getState().currentTestName ?? "unknown test";

const waitForHost = async (): Promise<void> => {
  await expect
    .poll(
      () =>
        (mounted?.host.querySelectorAll("[data-testid='root-container'] *")
          .length ?? 0) > 0,
      {
        timeout: 20_000,
        message: "The host never rendered anything from the remote tree.",
      },
    )
    .toBe(true);
};

const parityEnvironment = {
  /*
   * The same label in both passes, because the reused tests put it in their
   * name (`"Button states (%s)"`) and the reference file is keyed on that name.
   * Two labels would key the two passes to two files that never meet.
   */
  toString: () => "Parity",
  components: ReactComponents,
  container: rootContainerLocator,

  render: async (ui: ReactElement) => {
    if (isReference) {
      renderReference(ui);
      await waitForHost();
      return;
    }

    /*
     * A scenario the Vue surface cannot express throws out of here, naming the
     * component it could not map. The ones known not to be expressible never
     * reach this point — the runner filters them out by name, because several
     * interact with what they rendered and would otherwise time out on an
     * empty page rather than say why.
     */
    renderVue(ui);
    await waitForHost();
  },

  /*
   * Named for the method the reused tests call. It compares the host's DOM
   * rather than pixels: the question is whether Vue makes the host build the
   * same tree, and an image would answer it with a second set of baselines to
   * maintain.
   */
  testScreenshot: async (description: string): Promise<void> => {
    await setNeutralPointerPosition();
    const html = await readStableHtml();
    const reference = referencePathFor(description);
    const knownDivergence = isReference
      ? undefined
      : divergenceReasonFor(currentTestName());

    if (knownDivergence === undefined) {
      await expect(html).toMatchFileSnapshot(reference);
      return;
    }

    /*
     * A known divergence still has to be a divergence. Matching means the gap
     * was closed, and the entry would otherwise sit there forever, quietly
     * exempting a scenario that no longer needs it.
     */
    let matched = true;
    try {
      await expect(html).toMatchFileSnapshot(reference);
    } catch {
      matched = false;
    }

    if (matched) {
      throw new Error(
        `"${currentTestName()}" matches React again. Remove its entry from knownGaps.ts.`,
      );
    }
  },
};

export const testEnvironments = [parityEnvironment] as const;

export interface CrossVersionSkip {
  below?: string;
  exclude?: string[];
}

/** The reused tests call this; there is no version dimension here. */
export const crossVersion = (ignoredOptions: CrossVersionSkip): boolean =>
  false;
