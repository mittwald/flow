/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { DateRangePickerProps } from "@mittwald/flow-react-components/DateRangePicker";
export type { DateRangePickerProps } from "@mittwald/flow-react-components/DateRangePicker";

export const RemoteDateRangePickerElement =
  createRemoteElement<DateRangePickerProps>({
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
      allowsNonContiguousRanges: {},
      startName: {},
      endName: {},
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
    "flr-date-range-picker": InstanceType<typeof RemoteDateRangePickerElement>;
  }
}

customElements.define("flr-date-range-picker", RemoteDateRangePickerElement);
