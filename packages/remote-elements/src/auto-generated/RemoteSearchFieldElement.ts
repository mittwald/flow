/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SearchFieldProps as RemoteSearchFieldElementProps } from "@mittwald/flow-react-components";
export type { SearchFieldProps as RemoteSearchFieldElementProps } from "@mittwald/flow-react-components";

export class RemoteSearchFieldElement extends FlowRemoteElement<RemoteSearchFieldElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-activedescendant": {},
      "aria-autocomplete": {},
      "aria-controls": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-errormessage": {},
      "aria-haspopup": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoComplete: {},
      autoCorrect: {},
      autoFocus: {},
      className: {},
      defaultValue: {},
      dir: {},
      enterKeyHint: {},
      excludeFromTabOrder: {},
      form: {},
      hidden: {},
      id: {},
      inert: {},
      inputMode: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      lang: {},
      maxLength: {},
      minLength: {},
      name: {},
      pattern: {},
      slot: {},
      spellCheck: {},
      translate: {},
      type: {},
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
      beforeInput: {},
      blur: {},
      change: {},
      clear: {},
      click: {},
      clickCapture: {},
      compositionEnd: {},
      compositionStart: {},
      compositionUpdate: {},
      contextMenu: {},
      contextMenuCapture: {},
      copy: {},
      cut: {},
      doubleClick: {},
      doubleClickCapture: {},
      focus: {},
      focusChange: {},
      gotPointerCapture: {},
      gotPointerCaptureCapture: {},
      input: {},
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
      paste: {},
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
      select: {},
      submit: {},
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
    "flr-search-field": InstanceType<typeof RemoteSearchFieldElement>;
  }
}

customElements.define("flr-search-field", RemoteSearchFieldElement);
