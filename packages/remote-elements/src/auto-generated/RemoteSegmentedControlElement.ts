/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SegmentedControlProps as RemoteSegmentedControlElementProps } from "@mittwald/flow-react-components/SegmentedControl";
export type { SegmentedControlProps as RemoteSegmentedControlElementProps } from "@mittwald/flow-react-components/SegmentedControl";

export class RemoteSegmentedControlElement extends FlowRemoteElement<RemoteSegmentedControlElementProps> {
  static get remoteProperties() {
    return {
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
      value: {},
      defaultValue: {},
      id: {},
      name: {},
      slot: {},
      "aria-errormessage": {},
      orientation: {},
      wrapWith: {},
      containerBreakpointSize: {},
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      change: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-segmented-control": InstanceType<typeof RemoteSegmentedControlElement>;
  }
}

customElements.define("flr-segmented-control", RemoteSegmentedControlElement);
