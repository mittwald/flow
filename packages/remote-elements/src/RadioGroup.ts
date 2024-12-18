/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { RadioGroupProps } from "@mittwald/flow-react-components/RadioGroup";
export type { RadioGroupProps } from "@mittwald/flow-react-components/RadioGroup";

export const RemoteRadioGroupElement = createRemoteElement<RadioGroupProps>({
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
    value: {},
    defaultValue: {},
    id: {},
    name: {},
    "aria-errormessage": {},
    slot: {},
    orientation: {},
    children: {},
    wrapWith: {},
    s: {},
    m: {},
    l: {},
    ref: {},
    key: {},
  },
  events: {
    focus: {},
    blur: {},
    focusChange: {},
    change: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-radio-group": InstanceType<typeof RemoteRadioGroupElement>;
  }
}

customElements.define("flr-radio-group", RemoteRadioGroupElement);
