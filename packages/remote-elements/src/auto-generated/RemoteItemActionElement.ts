/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ItemActionProps as RemoteItemActionElementProps } from "@mittwald/flow-react-components";
export type { ItemActionProps as RemoteItemActionElementProps } from "@mittwald/flow-react-components";

export class RemoteItemActionElement extends FlowRemoteElement<RemoteItemActionElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-controls": {},
      "aria-current": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-disabled": {},
      "aria-expanded": {},
      "aria-haspopup": {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-pressed": {},
      autoFocus: {},
      className: {},
      dir: {},
      excludeFromTabOrder: {},
      form: {},
      formAction: {},
      formEncType: {},
      formMethod: {},
      formNoValidate: {},
      formTarget: {},
      hidden: {},
      id: {},
      inert: {},
      isDisabled: {},
      isFailed: {},
      isPending: {},
      isReadOnly: {},
      isSucceeded: {},
      lang: {},
      name: {},
      preventFocusOnPress: {},
      suppressHydrationWarning: {},
      translate: {},
      type: {},
      value: {},
      visibility: {},
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
      blur: {},
      click: {},
      clickCapture: {},
      contextMenu: {},
      contextMenuCapture: {},
      doubleClick: {},
      doubleClickCapture: {},
      focus: {},
      focusChange: {},
      gotPointerCapture: {},
      gotPointerCaptureCapture: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
      keyDown: {},
      keyUp: {},
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
      press: {},
      pressChange: {},
      pressEnd: {},
      pressStart: {},
      pressUp: {},
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
    "flr-item-action": InstanceType<typeof RemoteItemActionElement>;
  }
}

customElements.define("flr-item-action", RemoteItemActionElement);
