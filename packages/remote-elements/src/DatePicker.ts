/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { DatePickerProps } from "@mittwald/flow-react-components/DatePicker";
export type { DatePickerProps } from "@mittwald/flow-react-components/DatePicker";

export const RemoteDatePickerElement = createRemoteElement<DatePickerProps>({
  properties: {
    errorMessage: {},
    isOpen: {},
    defaultOpen: {},
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
    pageBehavior: {},
    minValue: {},
    maxValue: {},
    isDateUnavailable: {},
    placeholderValue: {},
    hourCycle: {},
    granularity: {},
    hideTimeZone: {},
    shouldForceLeadingZeros: {},
    shouldCloseOnSelect: {},
    children: {},
    ref: {},
    key: {},
  },
  events: {
    openChange: {},
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
    "flr-date-picker": InstanceType<typeof RemoteDatePickerElement>;
  }
}

customElements.define("flr-date-picker", RemoteDatePickerElement);
