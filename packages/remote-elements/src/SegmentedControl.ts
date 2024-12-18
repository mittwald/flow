/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { SegmentedControlProps } from "@mittwald/flow-react-components/SegmentedControl";
export type { SegmentedControlProps } from "@mittwald/flow-react-components/SegmentedControl";

export const RemoteSegmentedControlElement =
  createRemoteElement<SegmentedControlProps>({
    properties: {
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
      "aria-errormessage": {},
      slot: {},
      orientation: {},
      children: {},
      wrapWith: {},
      containerBreakpointSize: {},
      ref: {},
      key: {},
    },
    events: {
      focus: {},
      blur: {},
      focusChange: {},
      change: {},
    },
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-segmented-control": InstanceType<typeof RemoteSegmentedControlElement>;
  }
}

customElements.define("flr-segmented-control", RemoteSegmentedControlElement);
