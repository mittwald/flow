import { hostHtml } from "../../react-parity/hostHtml";
/*
 * A relative path into the React package, the way the corpus harness reaches
 * for the same container: it carries the 1280x720 box and the `root-container`
 * test id, so every binding is read out of the same frame.
 */
import {
  RootContainer,
  rootContainerLocator,
} from "../../../../remote-react-components/src/tests/lib/RootContainer";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { expect } from "vitest";

export { rootContainerLocator };

interface MountedHost {
  readonly container: HTMLElement;
  readonly receiver: RemoteReceiver;
  /** Where the binding mounts its remote app. */
  readonly remote: HTMLElement;
}

let mounted: (MountedHost & { tearDown: () => void }) | undefined;

/**
 * The host half — a React renderer fed by a receiver, as mStudio runs it.
 *
 * The host is React by definition, not by choice: it _is_ mStudio's backoffice.
 * What varies is which framework fills the remote side, which is why that half
 * is a `ParityBinding` and this one is not.
 */
export const mountHost = (): MountedHost => {
  unmountHost();

  const container = document.createElement("div");
  const remote = document.createElement("div");
  document.body.append(container, remote);

  const receiver = new RemoteReceiver();
  const reactRoot: Root = createRoot(container);

  reactRoot.render(
    createElement(
      RootContainer,
      null,
      createElement(RemoteRenderer, { __remoteReceiver: receiver }),
    ),
  );

  mounted = {
    container,
    receiver,
    remote,
    tearDown: () => {
      reactRoot.unmount();
      container.remove();
      remote.remove();
      mounted = undefined;
    },
  };

  return mounted;
};

export const unmountHost = (): void => mounted?.tearDown();

export const waitForHost = async (): Promise<void> => {
  await expect
    .poll(
      () =>
        (mounted?.container.querySelectorAll("[data-testid='root-container'] *")
          .length ?? 0) > 0,
      {
        timeout: 20_000,
        message: "The host never rendered anything from the remote tree.",
      },
    )
    .toBe(true);
};

/**
 * The host's output once it stops changing.
 *
 * The tree is materialised a round trip after the render, and a list settles a
 * second time when its first batch arrives — so this reads until the output
 * repeats rather than once.
 */
export const readStableHostHtml = async (
  stableReads = 4,
  intervalMs = 50,
  maxSamples = 200,
): Promise<string> => {
  const read = () => {
    const container = mounted?.container.querySelector(
      "[data-testid='root-container']",
    );

    if (!container) {
      return "";
    }

    /*
     * The container plus whatever the host portalled out of it.
     *
     * An overlay — a context menu, the all-filters modal — is rendered into
     * `document.body` rather than into the tree that opened it, so reading only
     * the container compares everything about a menu except the menu. What is
     * left out is the harness's own two roots: the host's, which the container
     * is inside, and the binding's remote tree, whose `flr-*` elements differ by
     * construction.
     *
     * And react-aria's live announcer, which is neither binding's output: one
     * element for the whole document, created when something is announced and
     * emptied on a timer of its own. A search in one scenario was still
     * announcing "0 matches" while the next one was read.
     */
    const portalled = Array.from(document.body.children).filter(
      (child) =>
        child !== mounted?.container &&
        child !== mounted?.remote &&
        !child.hasAttribute("data-live-announcer"),
    );

    const read = document.createElement("div");
    read.append(
      ...Array.from(container.children).map((child) => child.cloneNode(true)),
      ...portalled.map((child) => child.cloneNode(true)),
    );

    return hostHtml(read);
  };

  let previous = read();
  let consecutive = 1;

  for (let sample = 0; sample < maxSamples; sample++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    const next = read();
    if (next === previous) {
      consecutive += 1;
      if (consecutive >= stableReads && next.length > 0) {
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
 * Parks the pointer where it cannot hover anything and takes the focus off
 * whatever had it. Every binding renders into the same page, one after the
 * other, so a pointer left on a control puts `data-hovered` on one side only.
 */
export const setNeutralPointerPosition = async (): Promise<void> => {
  await rootContainerLocator.hover({ position: { x: 4, y: 4 }, force: true });
  rootContainerLocator.element().focus();
};
