/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { SegmentedControlProps as RemoteSegmentedControlElementProps } from "@mittwald/flow-react-components/SegmentedControl";
export type { SegmentedControlProps as RemoteSegmentedControlElementProps } from "@mittwald/flow-react-components/SegmentedControl";

export class RemoteSegmentedControlElement extends FlowRemoteElement<RemoteSegmentedControlElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-errormessage": {},
      "aria-label": {},
      "aria-labelledby": {},
      containerBreakpointSize: {},
      defaultValue: {},
      id: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      name: {},
      orientation: {},
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
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-segmented-control": InstanceType<typeof RemoteSegmentedControlElement>;
  }
}

customElements.define("flr-segmented-control", RemoteSegmentedControlElement);
