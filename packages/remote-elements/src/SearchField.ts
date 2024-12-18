/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { SearchFieldProps } from "@mittwald/flow-react-components/SearchField";
export type { SearchFieldProps } from "@mittwald/flow-react-components/SearchField";

export const RemoteSearchFieldElement = createRemoteElement<SearchFieldProps>({
  properties: {
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
    submit: {},
    clear: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-search-field": InstanceType<typeof RemoteSearchFieldElement>;
  }
}

customElements.define("flr-search-field", RemoteSearchFieldElement);
