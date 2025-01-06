/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TimeFieldProps } from "@mittwald/flow-react-components/TimeField";
export type { TimeFieldProps } from "@mittwald/flow-react-components/TimeField";

export class RemoteTimeFieldElement extends FlowRemoteElement<TimeFieldProps> {
  static get remoteProperties() {
    return {
      errorMessage: {},
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
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      name: {},
      className: {},
      style: {},
      slot: {},
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
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-time-field": InstanceType<typeof RemoteTimeFieldElement>;
  }
}

customElements.define("flr-time-field", RemoteTimeFieldElement);
