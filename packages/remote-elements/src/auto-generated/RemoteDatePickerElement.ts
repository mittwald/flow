/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { DatePickerProps as RemoteDatePickerElementProps } from "@mittwald/flow-react-components/DatePicker";
export type { DatePickerProps as RemoteDatePickerElementProps } from "@mittwald/flow-react-components/DatePicker";

export class RemoteDatePickerElement extends FlowRemoteElement<RemoteDatePickerElementProps> {
  static get remoteProperties() {
    return {
      errorMessage: {},
      isOpen: {},
      defaultOpen: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
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
      name: {},
      slot: {},
      pageBehavior: {},
      isDateUnavailable: {},
      shouldCloseOnSelect: {},
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
    "flr-date-picker": InstanceType<typeof RemoteDatePickerElement>;
  }
}

customElements.define("flr-date-picker", RemoteDatePickerElement);
