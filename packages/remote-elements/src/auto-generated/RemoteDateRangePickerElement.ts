/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { DateRangePickerProps as RemoteDateRangePickerElementProps } from "@mittwald/flow-react-components/DateRangePicker";
export type { DateRangePickerProps as RemoteDateRangePickerElementProps } from "@mittwald/flow-react-components/DateRangePicker";

export class RemoteDateRangePickerElement extends FlowRemoteElement<RemoteDateRangePickerElementProps> {
  static get remoteProperties() {
    return {
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
      hourCycle: {},
      granularity: {},
      hideTimeZone: {},
      shouldForceLeadingZeros: {},
      placeholderValue: {},
      minValue: {},
      maxValue: {},
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
      isDateUnavailable: {},
      shouldCloseOnSelect: {},
      allowsNonContiguousRanges: {},
      startName: {},
      endName: {},
    };
  }

  static get remoteEvents() {
    return {
      openChange: {},
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      change: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-date-range-picker": InstanceType<typeof RemoteDateRangePickerElement>;
  }
}

customElements.define("flr-date-range-picker", RemoteDateRangePickerElement);
