import * as Aria from "react-aria-components";
import { type FC, type PropsWithChildren, type Ref, Suspense } from "react";
import { UNSAFE_PortalProvider } from "react-aria";
import type { PropsWithClassName } from "@/lib/types/props";
import { OverlaySuspenseFallback } from "@/components/Overlay/components/OverlaySuspenseFallback";
import styles from "../Overlay.module.scss";
import DivView from "@/views/DivView";
import { useKeepBrowserExtensionsInteractive } from "@/lib/hooks/dom/useKeepBrowserExtensionsInteractive";

const overlayContainerAttribute = "data-flow-overlays";

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
    if (existingContainer !== document.body.lastElementChild) {
      document.body.append(existingContainer);
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

  useKeepBrowserExtensionsInteractive(restProps.isOpen ?? false);

  const Fallback = () => {
    return (
      <DivView className={styles.suspense}>
        <OverlaySuspenseFallback {...restProps} />
      </DivView>
    );
  };

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
