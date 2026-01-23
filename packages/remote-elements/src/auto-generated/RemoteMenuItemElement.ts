/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MenuItemProps as RemoteMenuItemElementProps } from "@mittwald/flow-react-components";
export type { MenuItemProps as RemoteMenuItemElementProps } from "@mittwald/flow-react-components";

export class RemoteMenuItemElement extends FlowRemoteElement<RemoteMenuItemElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-label": {},
      className: {},
      dir: {},
      download: {},
      hidden: {},
      href: {},
      hrefLang: {},
      id: {},
      inert: {},
      isDisabled: {},
      isFailed: {},
      isPending: {},
      isSucceeded: {},
      lang: {},
      ping: {},
      referrerPolicy: {},
      rel: {},
      routerOptions: {},
      selectionVariant: {},
      target: {},
      textValue: {},
      translate: {},
      value: {},
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
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
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
    "flr-menu-item": InstanceType<typeof RemoteMenuItemElement>;
  }
}

customElements.define("flr-menu-item", RemoteMenuItemElement);
