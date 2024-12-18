/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { TextFieldBaseProps } from "@mittwald/flow-react-components/TextFieldBase";
export type { TextFieldBaseProps } from "@mittwald/flow-react-components/TextFieldBase";

export const RemoteTextFieldBaseElement =
  createRemoteElement<TextFieldBaseProps>({
    properties: {
      input: {},
      showCharacterCount: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      className: {},
      style: {},
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
      slot: {},
      children: {},
      ref: {},
      key: {},
    },
    events: {
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
    },
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-field-base": InstanceType<typeof RemoteTextFieldBaseElement>;
  }
}

customElements.define("flr-text-field-base", RemoteTextFieldBaseElement);
