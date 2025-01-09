/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SegmentProps as RemoteSegmentElementProps } from "@mittwald/flow-react-components/SegmentedControl";
export type { SegmentProps as RemoteSegmentElementProps } from "@mittwald/flow-react-components/SegmentedControl";

export class RemoteSegmentElement extends FlowRemoteElement<RemoteSegmentElementProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      className: {},
      style: {},
      isDisabled: {},
      autoFocus: {},
      value: {},
      id: {},
      slot: {},
      inputRef: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      hoverStart: {},
      hoverEnd: {},
      hoverChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-segment": InstanceType<typeof RemoteSegmentElement>;
  }
}

customElements.define("flr-segment", RemoteSegmentElement);
