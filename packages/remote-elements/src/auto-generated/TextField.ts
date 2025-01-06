/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TextFieldProps } from "@mittwald/flow-react-components/TextField";
export type { TextFieldProps } from "@mittwald/flow-react-components/TextField";

export class RemoteTextFieldElement extends FlowRemoteElement<TextFieldProps> {
  static get remoteProperties() {
    return {
      children: {},
      validationBehavior: {},
      "aria-activedescendant": {},
      "aria-autocomplete": {},
      "aria-haspopup": {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      value: {},
      defaultValue: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      excludeFromTabOrder: {},
      id: {},
      autoComplete: {},
      maxLength: {},
      minLength: {},
      pattern: {},
      type: {},
      inputMode: {},
      name: {},
      "aria-errormessage": {},
      style: {},
      slot: {},
      showCharacterCount: {},
      placeholder: {},
      form: {},
      className: {},
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
      compositionStart: {},
      compositionEnd: {},
      compositionUpdate: {},
      select: {},
      beforeInput: {},
      input: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-field": InstanceType<typeof RemoteTextFieldElement>;
  }
}

customElements.define("flr-text-field", RemoteTextFieldElement);
