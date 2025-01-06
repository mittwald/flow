/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { DateRangePickerProps } from "@mittwald/flow-react-components/DateRangePicker";
export type { DateRangePickerProps } from "@mittwald/flow-react-components/DateRangePicker";

export class RemoteDateRangePickerElement extends FlowRemoteElement<DateRangePickerProps> {
  static get remoteProperties() {
    return {
      errorMessage: {},
      validationBehavior: {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      value: {},
      defaultValue: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      style: {},
      className: {},
      slot: {},
      isOpen: {},
      defaultOpen: {},
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
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      change: {},
      openChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-date-range-picker": InstanceType<typeof RemoteDateRangePickerElement>;
  }
}

customElements.define("flr-date-range-picker", RemoteDateRangePickerElement);
