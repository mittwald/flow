/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { DatePickerProps as RemoteDatePickerElementProps } from "@mittwald/flow-react-components/DatePicker";
export type { DatePickerProps as RemoteDatePickerElementProps } from "@mittwald/flow-react-components/DatePicker";

export class RemoteDatePickerElement extends FlowRemoteElement<RemoteDatePickerElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      defaultOpen: {},
      defaultValue: {},
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
      name: {},
      pageBehavior: {},
      placeholderValue: {},
      shouldCloseOnSelect: {},
      shouldForceLeadingZeros: {},
      slot: {},
      validate: {},
      validationBehavior: {},
      value: {},
    };
  }

  static override get remoteEvents() {
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

  static override get remoteSlots() {
    return ["errorMessage"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-date-picker": InstanceType<typeof RemoteDatePickerElement>;
  }
}

customElements.define("flr-date-picker", RemoteDatePickerElement);
