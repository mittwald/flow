/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TextFieldBaseProps } from "@mittwald/flow-react-components/TextFieldBase";
export type { TextFieldBaseProps } from "@mittwald/flow-react-components/TextFieldBase";

export class RemoteTextFieldBaseElement extends FlowRemoteElement<TextFieldBaseProps> {
  static get remoteProperties() {
    return {
      input: {},
      showCharacterCount: {},
      validationBehavior: {},
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
      id: {},
      name: {},
      className: {},
      style: {},
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
      children: {},
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
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-field-base": InstanceType<typeof RemoteTextFieldBaseElement>;
  }
}

customElements.define("flr-text-field-base", RemoteTextFieldBaseElement);
