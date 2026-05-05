/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableCellProps as RemoteTableCellElementProps } from "@mittwald/flow-react-components";
export type { TableCellProps as RemoteTableCellElementProps } from "@mittwald/flow-react-components";

export class RemoteTableCellElement extends FlowRemoteElement<RemoteTableCellElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      colSpan: {},
      dir: {},
      hidden: {},
      horizontalAlign: {},
      id: {},
      inert: {},
      lang: {},
      rowHeader: {},
      textValue: {},
      translate: {},
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
    "flr-table-cell": InstanceType<typeof RemoteTableCellElement>;
  }
}

customElements.define("flr-table-cell", RemoteTableCellElement);
