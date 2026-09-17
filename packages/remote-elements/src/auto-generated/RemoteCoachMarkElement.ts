/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CoachMarkProps as RemoteCoachMarkElementProps } from "@mittwald/flow-react-components";
export type { CoachMarkProps as RemoteCoachMarkElementProps } from "@mittwald/flow-react-components";

export class RemoteCoachMarkElement extends FlowRemoteElement<RemoteCoachMarkElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      anchor: {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      arrowBoundaryOffset: {},
      arrowRef: {},
      boundaryElement: {},
      className: {},
      containerPadding: {},
      crossOffset: {},
      dir: {},
      dismissLabel: {},
      hidden: {},
      hideDismissButton: {},
      inert: {},
      isDefaultOpen: {},
      isEntering: {},
      isExiting: {},
      isNonModal: {},
      isOpen: {},
      lang: {},
      maxHeight: {},
      offset: {},
      placement: {},
      scrollRef: {},
      shouldFlip: {},
      shouldSkipAnimation: {},
      shouldUpdatePosition: {},
      slot: {},
      translate: {},
      trigger: {},
      width: {},
    };
  }

  static override get remoteEvents() {
    return {
      animationEnd: {},
      animationEndCapture: {},
      animationIteration: {},
      animationIterationCapture: {},
      animationStart: {},
      animationStartCapture: {},
      auxClick: {},
      auxClickCapture: {},
      blurWithin: {},
      click: {},
      clickCapture: {},
      contextMenu: {},
      contextMenuCapture: {},
      doubleClick: {},
      doubleClickCapture: {},
      focusWithin: {},
      focusWithinChange: {},
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
    "flr-coach-mark": InstanceType<typeof RemoteCoachMarkElement>;
  }
}

customElements.define("flr-coach-mark", RemoteCoachMarkElement);
