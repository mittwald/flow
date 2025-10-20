/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { DateRangePickerProps as RemoteDateRangePickerElementProps } from "@mittwald/flow-react-components";
export type { DateRangePickerProps as RemoteDateRangePickerElementProps } from "@mittwald/flow-react-components";

export class RemoteDateRangePickerElement extends FlowRemoteElement<RemoteDateRangePickerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      allowsNonContiguousRanges: {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
      defaultOpen: {},
      defaultValue: {},
      dir: {},
      endName: {},
      firstDayOfWeek: {},
      form: {},
      granularity: {},
      hidden: {},
      hideTimeZone: {},
      hourCycle: {},
      id: {},
      inert: {},
      isDateUnavailable: {},
      isDisabled: {},
      isInvalid: {},
      isOpen: {},
      isReadOnly: {},
      isRequired: {},
      lang: {},
      maxValue: {},
      minValue: {},
      pageBehavior: {},
      placeholderValue: {},
      shouldCloseOnSelect: {},
      shouldForceLeadingZeros: {},
      slot: {},
      startName: {},
      translate: {},
      validate: {},
      validationBehavior: {},
      value: {},
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
      change: {},
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
    "flr-date-range-picker": InstanceType<typeof RemoteDateRangePickerElement>;
  }
}

customElements.define("flr-date-range-picker", RemoteDateRangePickerElement);
