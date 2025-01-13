/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TimeFieldProps as RemoteTimeFieldElementProps } from "@mittwald/flow-react-components/TimeField";
export type { TimeFieldProps as RemoteTimeFieldElementProps } from "@mittwald/flow-react-components/TimeField";

export class RemoteTimeFieldElement extends FlowRemoteElement<RemoteTimeFieldElementProps> {
  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      defaultValue: {},
      errorMessage: {},
      granularity: {},
      hideTimeZone: {},
      hourCycle: {},
      id: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      maxValue: {},
      minValue: {},
      name: {},
      placeholderValue: {},
      shouldForceLeadingZeros: {},
      slot: {},
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
