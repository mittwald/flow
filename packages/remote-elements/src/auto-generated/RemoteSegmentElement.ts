/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { SegmentProps as RemoteSegmentElementProps } from "@mittwald/flow-react-components/SegmentedControl";
export type { SegmentProps as RemoteSegmentElementProps } from "@mittwald/flow-react-components/SegmentedControl";

export class RemoteSegmentElement extends FlowRemoteElement<RemoteSegmentElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      id: {},
      inputRef: {},
      isDisabled: {},
      slot: {},
      value: {},
    };
  }

  static get remoteEvents() {
    return {
      blur: {},
      focus: {},
      focusChange: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
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
    "flr-segment": InstanceType<typeof RemoteSegmentElement>;
  }
}

customElements.define("flr-segment", RemoteSegmentElement);
