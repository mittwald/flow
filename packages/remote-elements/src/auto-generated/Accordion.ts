/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AccordionProps } from "@mittwald/flow-react-components/Accordion";
export type { AccordionProps } from "@mittwald/flow-react-components/Accordion";

export class RemoteAccordionElement extends FlowRemoteElement<AccordionProps> {
  static get remoteProperties() {
    return {
      defaultExpanded: {},
      variant: {},
      defaultChecked: {},
      defaultValue: {},
      suppressContentEditableWarning: {},
      suppressHydrationWarning: {},
      accessKey: {},
      autoCapitalize: {},
      autoFocus: {},
      className: {},
      contentEditable: {},
      contextMenu: {},
      dir: {},
      draggable: {},
      enterKeyHint: {},
      hidden: {},
      id: {},
      lang: {},
      nonce: {},
      slot: {},
      spellCheck: {},
      style: {},
      tabIndex: {},
      title: {},
      translate: {},
      radioGroup: {},
      role: {},
      about: {},
      content: {},
      datatype: {},
      inlist: {},
      prefix: {},
      property: {},
      rel: {},
      resource: {},
      rev: {},
      typeof: {},
      vocab: {},
      autoCorrect: {},
      autoSave: {},
      color: {},
      itemProp: {},
      itemScope: {},
      itemType: {},
      itemID: {},
      itemRef: {},
      results: {},
      security: {},
      unselectable: {},
      popover: {},
      popoverTargetAction: {},
      popoverTarget: {},
      inert: {},
      inputMode: {},
      is: {},
      "aria-activedescendant": {},
      "aria-atomic": {},
      "aria-autocomplete": {},
      "aria-braillelabel": {},
      "aria-brailleroledescription": {},
      "aria-busy": {},
      "aria-checked": {},
      "aria-colcount": {},
      "aria-colindex": {},
      "aria-colindextext": {},
      "aria-colspan": {},
      "aria-controls": {},
      "aria-current": {},
      "aria-describedby": {},
      "aria-description": {},
      "aria-details": {},
      "aria-disabled": {},
      "aria-dropeffect": {},
      "aria-errormessage": {},
      "aria-expanded": {},
      "aria-flowto": {},
      "aria-grabbed": {},
      "aria-haspopup": {},
      "aria-hidden": {},
      "aria-invalid": {},
      "aria-keyshortcuts": {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-level": {},
      "aria-live": {},
      "aria-modal": {},
      "aria-multiline": {},
      "aria-multiselectable": {},
      "aria-orientation": {},
      "aria-owns": {},
      "aria-placeholder": {},
      "aria-posinset": {},
      "aria-pressed": {},
      "aria-readonly": {},
      "aria-relevant": {},
      "aria-required": {},
      "aria-roledescription": {},
      "aria-rowcount": {},
      "aria-rowindex": {},
      "aria-rowindextext": {},
      "aria-rowspan": {},
      "aria-selected": {},
      "aria-setsize": {},
      "aria-sort": {},
      "aria-valuemax": {},
      "aria-valuemin": {},
      "aria-valuenow": {},
      "aria-valuetext": {},
      children: {},
      dangerouslySetInnerHTML: {},
    };
  }

  static get remoteEvents() {
    return {
      copy: {},
      copyCapture: {},
      cut: {},
      cutCapture: {},
      paste: {},
      pasteCapture: {},
      compositionEnd: {},
      compositionEndCapture: {},
      compositionStart: {},
      compositionStartCapture: {},
      compositionUpdate: {},
      compositionUpdateCapture: {},
      focus: {},
      focusCapture: {},
      blur: {},
      blurCapture: {},
      change: {},
      changeCapture: {},
      beforeInput: {},
      beforeInputCapture: {},
      input: {},
      inputCapture: {},
      reset: {},
      resetCapture: {},
      submit: {},
      submitCapture: {},
      invalid: {},
      invalidCapture: {},
      load: {},
      loadCapture: {},
      error: {},
      errorCapture: {},
      keyDown: {},
      keyDownCapture: {},
      keyPress: {},
      keyPressCapture: {},
      keyUp: {},
      keyUpCapture: {},
      abort: {},
      abortCapture: {},
      canPlay: {},
      canPlayCapture: {},
      canPlayThrough: {},
      canPlayThroughCapture: {},
      durationChange: {},
      durationChangeCapture: {},
      emptied: {},
      emptiedCapture: {},
      encrypted: {},
      encryptedCapture: {},
      ended: {},
      endedCapture: {},
      loadedData: {},
      loadedDataCapture: {},
      loadedMetadata: {},
      loadedMetadataCapture: {},
      loadStart: {},
      loadStartCapture: {},
      pause: {},
      pauseCapture: {},
      play: {},
      playCapture: {},
      playing: {},
      playingCapture: {},
      progress: {},
      progressCapture: {},
      rateChange: {},
      rateChangeCapture: {},
      resize: {},
      resizeCapture: {},
      seeked: {},
      seekedCapture: {},
      seeking: {},
      seekingCapture: {},
      stalled: {},
      stalledCapture: {},
      suspend: {},
      suspendCapture: {},
      timeUpdate: {},
      timeUpdateCapture: {},
      volumeChange: {},
      volumeChangeCapture: {},
      waiting: {},
      waitingCapture: {},
      auxClick: {},
      auxClickCapture: {},
      click: {},
      clickCapture: {},
      contextMenu: {},
      contextMenuCapture: {},
      doubleClick: {},
      doubleClickCapture: {},
      drag: {},
      dragCapture: {},
      dragEnd: {},
      dragEndCapture: {},
      dragEnter: {},
      dragEnterCapture: {},
      dragExit: {},
      dragExitCapture: {},
      dragLeave: {},
      dragLeaveCapture: {},
      dragOver: {},
      dragOverCapture: {},
      dragStart: {},
      dragStartCapture: {},
      drop: {},
      dropCapture: {},
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
      select: {},
      selectCapture: {},
      touchCancel: {},
      touchCancelCapture: {},
      touchEnd: {},
      touchEndCapture: {},
      touchMove: {},
      touchMoveCapture: {},
      touchStart: {},
      touchStartCapture: {},
      pointerDown: {},
      pointerDownCapture: {},
      pointerMove: {},
      pointerMoveCapture: {},
      pointerUp: {},
      pointerUpCapture: {},
      pointerCancel: {},
      pointerCancelCapture: {},
      pointerEnter: {},
      pointerLeave: {},
      pointerOver: {},
      pointerOverCapture: {},
      pointerOut: {},
      pointerOutCapture: {},
      gotPointerCapture: {},
      gotPointerCaptureCapture: {},
      lostPointerCapture: {},
      lostPointerCaptureCapture: {},
      scroll: {},
      scrollCapture: {},
      wheel: {},
      wheelCapture: {},
      animationStart: {},
      animationStartCapture: {},
      animationEnd: {},
      animationEndCapture: {},
      animationIteration: {},
      animationIterationCapture: {},
      toggle: {},
      beforeToggle: {},
      transitionCancel: {},
      transitionCancelCapture: {},
      transitionEnd: {},
      transitionEndCapture: {},
      transitionRun: {},
      transitionRunCapture: {},
      transitionStart: {},
      transitionStartCapture: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-accordion": InstanceType<typeof RemoteAccordionElement>;
  }
}

customElements.define("flr-accordion", RemoteAccordionElement);
