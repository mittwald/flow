/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { NumberFieldProps } from "@mittwald/flow-react-components/NumberField";
export type { NumberFieldProps } from "@mittwald/flow-react-components/NumberField";

export const RemoteNumberFieldElement = createRemoteElement<NumberFieldProps>({
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
    defaultValue: {},
    id: {},
    name: {},
    slot: {},
    step: {},
    minValue: {},
    maxValue: {},
    decrementAriaLabel: {},
    incrementAriaLabel: {},
    isWheelDisabled: {},
    formatOptions: {},
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
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-number-field": InstanceType<typeof RemoteNumberFieldElement>;
  }
}

customElements.define("flr-number-field", RemoteNumberFieldElement);
