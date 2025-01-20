/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { SegmentProps as RemoteSegmentElementProps } from "@mittwald/flow-react-components/SegmentedControl";
export type { SegmentProps as RemoteSegmentElementProps } from "@mittwald/flow-react-components/SegmentedControl";

export class RemoteSegmentElement extends FlowRemoteElement<RemoteSegmentElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
      id: {},
      inputRef: {},
      isDisabled: {},
      slot: {},
      value: {},
    };
  }

  static override get remoteEvents() {
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

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-segment": InstanceType<typeof RemoteSegmentElement>;
  }
}

customElements.define("flr-segment", RemoteSegmentElement);
