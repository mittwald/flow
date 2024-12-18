/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { CheckboxProps } from "@mittwald/flow-react-components/Checkbox";
export type { CheckboxProps } from "@mittwald/flow-react-components/Checkbox";

export const RemoteCheckboxElement = createRemoteElement<CheckboxProps>({
  properties: {
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
    excludeFromTabOrder: {},
    id: {},
    name: {},
    "aria-errormessage": {},
    slot: {},
    "aria-controls": {},
    isIndeterminate: {},
    defaultSelected: {},
    isSelected: {},
    inputRef: {},
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
    hoverStart: {},
    hoverEnd: {},
    hoverChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-checkbox": InstanceType<typeof RemoteCheckboxElement>;
  }
}

customElements.define("flr-checkbox", RemoteCheckboxElement);
