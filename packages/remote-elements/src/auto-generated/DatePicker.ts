/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { DatePickerProps } from "@mittwald/flow-react-components/DatePicker";
export type { DatePickerProps } from "@mittwald/flow-react-components/DatePicker";

export class RemoteDatePickerElement extends FlowRemoteElement<DatePickerProps> {
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
      name: {},
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
    "flr-date-picker": InstanceType<typeof RemoteDatePickerElement>;
  }
}

customElements.define("flr-date-picker", RemoteDatePickerElement);
