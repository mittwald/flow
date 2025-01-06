/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SegmentedControlProps } from "@mittwald/flow-react-components/SegmentedControl";
export type { SegmentedControlProps } from "@mittwald/flow-react-components/SegmentedControl";

export class RemoteSegmentedControlElement extends FlowRemoteElement<SegmentedControlProps> {
  static get remoteProperties() {
    return {
      validationBehavior: {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      value: {},
      defaultValue: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      name: {},
      "aria-errormessage": {},
      style: {},
      className: {},
      slot: {},
      orientation: {},
      children: {},
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
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-segmented-control": InstanceType<typeof RemoteSegmentedControlElement>;
  }
}

customElements.define("flr-segmented-control", RemoteSegmentedControlElement);
