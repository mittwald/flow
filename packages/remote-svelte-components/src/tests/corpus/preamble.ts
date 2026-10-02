import { page } from "vitest/browser";
import { expect } from "vitest";

/*
 * The visual suite's preamble, minus the parts a screenshot needs.
 *
 * `remote-react-components/src/tests/lib/environments.tsx` has the full
 * version, and it is longer for one reason: `toMatchScreenshot` decides a page
 * is ready by comparing two frames, so it needs the pointer parked and the
 * stability heuristic defused. A DOM snapshot needs neither — only that the
 * host has actually rendered and stopped moving.
 *
 * What it does keep is why those waits exist at all: `render()` resolves before
 * <RemoteRenderer /> has materialised the host tree, and every interaction
 * lands a serializer round trip late.
 */
const rootContainerLocator = page.getByTestId("root-container");

const isPainted = (element: Element): boolean => {
  const { width, height } = element.getBoundingClientRect();
  if (width === 0 || height === 0) {
    return false;
  }
  const { display, visibility } = getComputedStyle(element);
  return display !== "none" && visibility !== "hidden";
};

const waitForPaintedContent = async (): Promise<void> => {
  await expect
    .poll(
      () =>
        [...rootContainerLocator.element().querySelectorAll("*")].some(
          isPainted,
        ),
      {
        timeout: 20_000,
        message:
          "The host never rendered any content, so the snapshot would have been empty.",
      },
    )
    .toBe(true);
};

const settleQuietFor = 100;
const settleTimeout = 2000;

const waitForSettledContent = async (): Promise<void> =>
  new Promise<void>((resolve) => {
    let quiet: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver(() => {
      clearTimeout(quiet);
      quiet = setTimeout(finish, settleQuietFor);
    });

    const deadline = setTimeout(finish, settleTimeout);

    function finish() {
      clearTimeout(quiet);
      clearTimeout(deadline);
      observer.disconnect();
      resolve();
    }

    quiet = setTimeout(finish, settleQuietFor);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
  });

/*
 * Parks the pointer inside the container's 32px padding and gives the container
 * the focus, exactly as `renderLocal`/`renderRemote` do before a screenshot.
 *
 * Without it nothing in the document is focused, and the three scenarios that
 * synchronise on the focus (`scenarioFocus.ts`, e.g. `CodeBlock truncated`)
 * wait for it to enter a container it never left `body` for.
 */
export const setNeutralPointerPosition = async (): Promise<void> => {
  await rootContainerLocator.hover({ position: { x: 4, y: 4 }, force: true });
  rootContainerLocator.element().focus();
};

export const prepareForSnapshot = async (): Promise<void> => {
  await waitForPaintedContent();
  await waitForSettledContent();
  /*
   * Also before the capture, not only after `render`: a scenario that clicked
   * something leaves the pointer on it, and `data-hovered` / `data-pressed` are
   * in the DOM the two runs are compared on. The React preamble parks it here
   * for the same reason, one step further along — there it is a focus ring in a
   * screenshot.
   */
  await setNeutralPointerPosition();
};

export const rootContainer = (): HTMLElement =>
  rootContainerLocator.element() as HTMLElement;
