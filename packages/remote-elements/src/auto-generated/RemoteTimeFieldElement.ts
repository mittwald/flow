/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TimeFieldProps as RemoteTimeFieldElementProps } from "@mittwald/flow-react-components/TimeField";
export type { TimeFieldProps as RemoteTimeFieldElementProps } from "@mittwald/flow-react-components/TimeField";

export class RemoteTimeFieldElement extends FlowRemoteElement<RemoteTimeFieldElementProps> {
  static get remoteProperties() {
    return {
      errorMessage: {},
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
      name: {},
      slot: {},
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
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-time-field": InstanceType<typeof RemoteTimeFieldElement>;
  }
}

customElements.define("flr-time-field", RemoteTimeFieldElement);
