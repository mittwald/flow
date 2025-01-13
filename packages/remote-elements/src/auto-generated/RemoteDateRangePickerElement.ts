/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { DateRangePickerProps as RemoteDateRangePickerElementProps } from "@mittwald/flow-react-components/DateRangePicker";
export type { DateRangePickerProps as RemoteDateRangePickerElementProps } from "@mittwald/flow-react-components/DateRangePicker";

export class RemoteDateRangePickerElement extends FlowRemoteElement<RemoteDateRangePickerElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      allowsNonContiguousRanges: {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      defaultOpen: {},
      defaultValue: {},
      endName: {},
      granularity: {},
      hideTimeZone: {},
      hourCycle: {},
      id: {},
      isDateUnavailable: {},
      isDisabled: {},
      isInvalid: {},
      isOpen: {},
      isReadOnly: {},
      isRequired: {},
      maxValue: {},
      minValue: {},
      pageBehavior: {},
      placeholderValue: {},
      shouldCloseOnSelect: {},
      shouldForceLeadingZeros: {},
      slot: {},
      startName: {},
      validate: {},
      validationBehavior: {},
      value: {},
    };
  }

  static get remoteEvents() {
    return {
      blur: {},
      change: {},
      focus: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      openChange: {},
    };
  }

  static get remoteSlots() {
    return ["errorMessage"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-date-range-picker": InstanceType<typeof RemoteDateRangePickerElement>;
  }
}

customElements.define("flr-date-range-picker", RemoteDateRangePickerElement);
