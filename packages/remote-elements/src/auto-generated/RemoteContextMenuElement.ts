/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components";
export type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components";

export class RemoteContextMenuElement extends FlowRemoteElement<RemoteContextMenuElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      UNSTABLE_portalContainer: {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      arrowBoundaryOffset: {},
      boundaryElement: {},
      className: {},
      containerPadding: {},
      crossOffset: {},
      defaultOpen: {},
      defaultSelectedKeys: {},
      dir: {},
      disabledKeys: {},
      hidden: {},
      inert: {},
      isDialogContent: {},
      isEntering: {},
      isExiting: {},
      isKeyboardDismissDisabled: {},
      isNonModal: {},
      isOpen: {},
      lang: {},
      maxHeight: {},
      offset: {},
      placement: {},
      renderEmptyState: {},
      scrollRef: {},
      selectedKeys: {},
      selectionMode: {},
      shouldCloseOnInteractOutside: {},
      shouldFlip: {},
      shouldUpdatePosition: {},
      slot: {},
      translate: {},
      trigger: {},
      triggerRef: {},
      width: {},
    };
  }

  static override get remoteEvents() {
    return {
      action: {},
      animationEnd: {},
      animationEndCapture: {},
      animationIteration: {},
      animationIterationCapture: {},
      animationStart: {},
      animationStartCapture: {},
      auxClick: {},
      auxClickCapture: {},
      click: {},
      clickCapture: {},
      contextMenu: {},
      contextMenuCapture: {},
      doubleClick: {},
      doubleClickCapture: {},
      gotPointerCapture: {},
      gotPointerCaptureCapture: {},
      lostPointerCapture: {},
      lostPointerCaptureCapture: {},
      mouseDown: {},
      mouseDownCapture: {},
      mouseEnter: {},
      mouseLeave: {},
      mouseMove: {},
      mouseMoveCapture: {},
      mouseOut: {},
      mouseOutCapture: {},
      mouseOver: {},
      mouseOverCapture: {},
      mouseUp: {},
      mouseUpCapture: {},
      openChange: {},
      pointerCancel: {},
      pointerCancelCapture: {},
      pointerDown: {},
      pointerDownCapture: {},
      pointerEnter: {},
      pointerLeave: {},
      pointerMove: {},
      pointerMoveCapture: {},
      pointerOut: {},
      pointerOutCapture: {},
      pointerOver: {},
      pointerOverCapture: {},
      pointerUp: {},
      pointerUpCapture: {},
      scroll: {},
      scrollCapture: {},
      selectionChange: {},
      touchCancel: {},
      touchCancelCapture: {},
      touchEnd: {},
      touchEndCapture: {},
      touchMove: {},
      touchMoveCapture: {},
      touchStart: {},
      touchStartCapture: {},
      transitionCancel: {},
      transitionCancelCapture: {},
      transitionEnd: {},
      transitionEndCapture: {},
      transitionRun: {},
      transitionRunCapture: {},
      transitionStart: {},
      transitionStartCapture: {},
      wheel: {},
      wheelCapture: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-context-menu": InstanceType<typeof RemoteContextMenuElement>;
  }
}

customElements.define("flr-context-menu", RemoteContextMenuElement);
