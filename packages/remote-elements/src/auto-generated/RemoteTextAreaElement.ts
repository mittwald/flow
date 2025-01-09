/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TextAreaProps as RemoteTextAreaElementProps } from "@mittwald/flow-react-components/TextArea";
export type { TextAreaProps as RemoteTextAreaElementProps } from "@mittwald/flow-react-components/TextArea";

export class RemoteTextAreaElement extends FlowRemoteElement<RemoteTextAreaElementProps> {
  static get remoteProperties() {
    return {
      autoResizeMaxRows: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      className: {},
      style: {},
      validationBehavior: {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      value: {},
      defaultValue: {},
      id: {},
      name: {},
      slot: {},
      pattern: {},
      inputMode: {},
      "aria-activedescendant": {},
      "aria-autocomplete": {},
      "aria-errormessage": {},
      "aria-haspopup": {},
      type: {},
      excludeFromTabOrder: {},
      autoComplete: {},
      maxLength: {},
      minLength: {},
      showCharacterCount: {},
      placeholder: {},
      rows: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      change: {},
      copy: {},
      cut: {},
      paste: {},
      compositionEnd: {},
      compositionStart: {},
      compositionUpdate: {},
      beforeInput: {},
      input: {},
      select: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-area": InstanceType<typeof RemoteTextAreaElement>;
  }
}

customElements.define("flr-text-area", RemoteTextAreaElement);
