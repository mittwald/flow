/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContentProps as RemoteContentElementProps } from "@mittwald/flow-react-components/Content";
export type { ContentProps as RemoteContentElementProps } from "@mittwald/flow-react-components/Content";

export class RemoteContentElement extends FlowRemoteElement<RemoteContentElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      about: {},
      accessKey: {},
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
      autoCapitalize: {},
      autoCorrect: {},
      autoFocus: {},
      autoSave: {},
      className: {},
      clearPropsContext: {},
      color: {},
      content: {},
      contentEditable: {},
      contextMenu: {},
      datatype: {},
      defaultChecked: {},
      defaultValue: {},
      dir: {},
      draggable: {},
      elementType: {},
      enterKeyHint: {},
      hidden: {},
      id: {},
      inert: {},
      inlist: {},
      inputMode: {},
      is: {},
      itemID: {},
      itemProp: {},
      itemRef: {},
      itemScope: {},
      itemType: {},
      lang: {},
      nonce: {},
      popover: {},
      popoverTarget: {},
      popoverTargetAction: {},
      prefix: {},
      property: {},
      radioGroup: {},
      rel: {},
      resource: {},
      results: {},
      rev: {},
      role: {},
      security: {},
      slot: {},
      spellCheck: {},
      suppressContentEditableWarning: {},
      suppressHydrationWarning: {},
      tabIndex: {},
      title: {},
      translate: {},
      typeof: {},
      unselectable: {},
      vocab: {},
    };
  }

  static override get remoteEvents() {
    return {
      abort: {},
      abortCapture: {},
      animationEnd: {},
      animationEndCapture: {},
      animationIteration: {},
      animationIterationCapture: {},
      animationStart: {},
      animationStartCapture: {},
      auxClick: {},
      auxClickCapture: {},
      beforeInput: {},
      beforeInputCapture: {},
      beforeToggle: {},
      blur: {},
      blurCapture: {},
      canPlay: {},
      canPlayCapture: {},
      canPlayThrough: {},
      canPlayThroughCapture: {},
      change: {},
      changeCapture: {},
      click: {},
      clickCapture: {},
      compositionEnd: {},
      compositionEndCapture: {},
      compositionStart: {},
      compositionStartCapture: {},
      compositionUpdate: {},
      compositionUpdateCapture: {},
      contextMenu: {},
      contextMenuCapture: {},
      copy: {},
      copyCapture: {},
      cut: {},
      cutCapture: {},
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
      durationChange: {},
      durationChangeCapture: {},
      emptied: {},
      emptiedCapture: {},
      encrypted: {},
      encryptedCapture: {},
      ended: {},
      endedCapture: {},
      error: {},
      errorCapture: {},
      focus: {},
      focusCapture: {},
      gotPointerCapture: {},
      gotPointerCaptureCapture: {},
      input: {},
      inputCapture: {},
      invalid: {},
      invalidCapture: {},
      keyDown: {},
      keyDownCapture: {},
      keyPress: {},
      keyPressCapture: {},
      keyUp: {},
      keyUpCapture: {},
      load: {},
      loadCapture: {},
      loadStart: {},
      loadStartCapture: {},
      loadedData: {},
      loadedDataCapture: {},
      loadedMetadata: {},
      loadedMetadataCapture: {},
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
      pasteCapture: {},
      pause: {},
      pauseCapture: {},
      play: {},
      playCapture: {},
      playing: {},
      playingCapture: {},
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
      progress: {},
      progressCapture: {},
      rateChange: {},
      rateChangeCapture: {},
      reset: {},
      resetCapture: {},
      resize: {},
      resizeCapture: {},
      scroll: {},
      scrollCapture: {},
      seeked: {},
      seekedCapture: {},
      seeking: {},
      seekingCapture: {},
      select: {},
      selectCapture: {},
      stalled: {},
      stalledCapture: {},
      submit: {},
      submitCapture: {},
      suspend: {},
      suspendCapture: {},
      timeUpdate: {},
      timeUpdateCapture: {},
      toggle: {},
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
      volumeChange: {},
      volumeChangeCapture: {},
      waiting: {},
      waitingCapture: {},
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
    "flr-content": InstanceType<typeof RemoteContentElement>;
  }
}

customElements.define("flr-content", RemoteContentElement);
