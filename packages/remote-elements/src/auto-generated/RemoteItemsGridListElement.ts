/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { GridListProps as RemoteItemsGridListElementProps } from "@mittwald/flow-react-components";
export type { GridListProps as RemoteItemsGridListElementProps } from "@mittwald/flow-react-components";

export class RemoteItemsGridListElement extends FlowRemoteElement<RemoteItemsGridListElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
      defaultSelectedKeys: {},
      dependencies: {},
      dir: {},
      disabledBehavior: {},
      disabledKeys: {},
      disallowEmptySelection: {},
      disallowTypeAhead: {},
      dragAndDropHooks: {},
      escapeKeyBehavior: {},
      hidden: {},
      id: {},
      inert: {},
      items: {},
      keyboardNavigationBehavior: {},
      lang: {},
      layout: {},
      renderEmptyState: {},
      selectedKeys: {},
      selectionBehavior: {},
      selectionMode: {},
      shouldSelectOnPressUp: {},
      slot: {},
      tileMaxWidth: {},
      translate: {},
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
    "flr-items-grid-list": InstanceType<typeof RemoteItemsGridListElement>;
  }
}

customElements.define("flr-items-grid-list", RemoteItemsGridListElement);
