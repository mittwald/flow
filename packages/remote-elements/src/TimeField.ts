/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { TimeFieldProps } from "@mittwald/flow-react-components/TimeField";
export type { TimeFieldProps } from "@mittwald/flow-react-components/TimeField";

export const RemoteTimeFieldElement = createRemoteElement<TimeFieldProps>({
  properties: {
    errorMessage: {},
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
    minValue: {},
    maxValue: {},
    placeholderValue: {},
    hourCycle: {},
    granularity: {},
    hideTimeZone: {},
    shouldForceLeadingZeros: {},
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
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-time-field": InstanceType<typeof RemoteTimeFieldElement>;
  }
}

customElements.define("flr-time-field", RemoteTimeFieldElement);
