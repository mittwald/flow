/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { TextAreaProps as RemoteTextAreaElementProps } from "@mittwald/flow-react-components/TextArea";
export type { TextAreaProps as RemoteTextAreaElementProps } from "@mittwald/flow-react-components/TextArea";

export class RemoteTextAreaElement extends FlowRemoteElement<RemoteTextAreaElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-activedescendant": {},
      "aria-autocomplete": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-errormessage": {},
      "aria-haspopup": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoComplete: {},
      autoFocus: {},
      autoResizeMaxRows: {},
      defaultValue: {},
      excludeFromTabOrder: {},
      id: {},
      inputMode: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      maxLength: {},
      minLength: {},
      name: {},
      pattern: {},
      placeholder: {},
      rows: {},
      showCharacterCount: {},
      slot: {},
      type: {},
      validate: {},
      validationBehavior: {},
      value: {},
    };
  }

  static get remoteEvents() {
    return {
      beforeInput: {},
      blur: {},
      change: {},
      compositionEnd: {},
      compositionStart: {},
      compositionUpdate: {},
      copy: {},
      cut: {},
      focus: {},
      focusChange: {},
      input: {},
      keyDown: {},
      keyUp: {},
      paste: {},
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
