import * as Aria from "react-aria-components";
import { type FC, type PropsWithChildren, type Ref, Suspense } from "react";
import { UNSAFE_PortalProvider } from "react-aria";
import type { PropsWithClassName } from "@/lib/types/props";
import { OverlaySuspenseFallback } from "@/components/Overlay/components/OverlaySuspenseFallback";
import styles from "../Overlay.module.scss";
import DivView from "@/views/DivView";
import {
  isBrowserExtensionNode,
  useKeepBrowserExtensionsInteractive,
} from "@/lib/hooks/dom/useKeepBrowserExtensionsInteractive";
import { useIsActivityActive } from "@/components/Activity/context";

const overlayContainerAttribute = "data-flow-overlays";

/**
 * Nodes a browser extension appends (e.g. 1Password's inline menu) don't count
 * as covering: they belong on top anyway, and moving the container for them
 * blurs a focused field inside it (#3268). The same heuristic also spares
 * custom elements and shadow hosts the page itself appends, which then render
 * above open overlays.
 */
const isCoveredByPageContent = (container: HTMLElement): boolean => {
  for (
    let node = container.nextElementSibling;
    node;
    node = node.nextElementSibling
  ) {
    if (!isBrowserExtensionNode(node)) {
      return true;
    }
  }
  return false;
};

/**
 * Only the container moves, never the nodes appended after it: those are
 * foreign, and moving them costs state we cannot restore (an iframe reloads).
 * The container's own state we can. Moving a node blurs the focused element
 * inside it and resets every scroll container inside to the top. `moveBefore`
 * keeps the focus (and, in Chromium, the scroll positions); the rest is
 * restored afterwards.
 */
const moveToEnd = (container: HTMLElement): void => {
  const body = document.body;
  const focused = document.activeElement;
  const scrolled = Array.from(container.querySelectorAll<HTMLElement>("*"))
    .filter((element) => element.scrollTop !== 0 || element.scrollLeft !== 0)
    .map(
      (element) => [element, element.scrollTop, element.scrollLeft] as const,
    );

  if (typeof body.moveBefore === "function") {
    body.moveBefore(container, null);
  } else {
    body.append(container);
  }

  for (const [element, scrollTop, scrollLeft] of scrolled) {
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  }
  if (
    focused instanceof HTMLElement &&
    container.contains(focused) &&
    document.activeElement !== focused
  ) {
    focused.focus({ preventScroll: true });
  }
};

/**
 * Render overlays into a dedicated container instead of `document.body`.
 *
 * React Aria `FocusScope` relies on nearby sibling nodes (sentinels + overlay).
 * Browser extensions (e.g. password managers) inject/reorder `body` children,
 * which can separate those nodes. Then focus scope detection breaks and may
 * cause recursive focus restoration.
 *
 * Keep the overlay container as the last child of body.
 *
 * React Aria normally portals overlays directly into body, so they are appended
 * last and render on top.
 *
 * If we create one persistent container only once, anything appended to body
 * later (toasts, third-party widgets, remounted app root) can render above open
 * overlays. Then overlays can appear behind page content, and the backdrop blur
 * no longer covers the page.
 */
const getOverlayContainer = (): HTMLElement | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const existingContainer = document.querySelector<HTMLElement>(
    `body > [${overlayContainerAttribute}]`,
  );

  if (existingContainer) {
    if (isCoveredByPageContent(existingContainer)) {
      moveToEnd(existingContainer);
    }
    return existingContainer;
  }

  const container = document.createElement("div");
  container.setAttribute(overlayContainerAttribute, "");
  document.body.append(container);

  return container;
};

export interface OverlayContentProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    Pick<Aria.DialogProps, "aria-labelledby"> {
  ref?: Ref<HTMLDivElement>;
  onOpenChange: (isOpen: boolean) => void;
  isDismissable?: boolean;
  isOpen?: boolean;
}

/** @flr-generate all */
export const OverlayContent: FC<OverlayContentProps> = (props) => {
  const {
    children,
    className,
    "aria-labelledby": ariaLabelledBy,
    ...restProps
  } = props;

  const isActivityActive = useIsActivityActive();

  useKeepBrowserExtensionsInteractive(restProps.isOpen ?? false);

  const Fallback = () => {
    return (
      <DivView className={styles.suspense}>
        <OverlaySuspenseFallback {...restProps} />
      </DivView>
    );
  };

  if (!isActivityActive) {
    return null;
  }

  return (
    <UNSAFE_PortalProvider getContainer={getOverlayContainer}>
      <Aria.ModalOverlay {...restProps} className={className}>
        {/* The centering viewport between the backdrop and react-aria's modal
            wrapper. Classed so Modal/OffCanvas/LightBox can position it
            without selecting a bare `div`. */}
        <DivView className={styles.viewport}>
          <Aria.Modal>
            <Suspense fallback={<Fallback />}>
              <Aria.Dialog aria-labelledby={ariaLabelledBy}>
                {children}
              </Aria.Dialog>
            </Suspense>
          </Aria.Modal>
        </DivView>
      </Aria.ModalOverlay>
    </UNSAFE_PortalProvider>
  );
};

export default OverlayContent;
