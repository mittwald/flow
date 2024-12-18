/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { TextAreaProps } from "@mittwald/flow-react-components/TextArea";
export type { TextAreaProps } from "@mittwald/flow-react-components/TextArea";

export const RemoteTextAreaElement = createRemoteElement<TextAreaProps>({
  properties: {
    autoResizeMaxRows: {},
    children: {},
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
    showCharacterCount: {},
    placeholder: {},
    rows: {},
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
    "flr-text-area": InstanceType<typeof RemoteTextAreaElement>;
  }
}

customElements.define("flr-text-area", RemoteTextAreaElement);
