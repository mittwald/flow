/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { TextFieldProps } from "@mittwald/flow-react-components/TextField";
export type { TextFieldProps } from "@mittwald/flow-react-components/TextField";

export const RemoteTextFieldElement = createRemoteElement<TextFieldProps>({
  properties: {
    children: {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
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
    showCharacterCount: {},
    placeholder: {},
    className: {},
    wrapWith: {},
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
    "flr-text-field": InstanceType<typeof RemoteTextFieldElement>;
  }
}

customElements.define("flr-text-field", RemoteTextFieldElement);
