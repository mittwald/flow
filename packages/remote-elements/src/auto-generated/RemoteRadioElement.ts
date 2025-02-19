/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { RadioProps as RemoteRadioElementProps } from "@mittwald/flow-react-components";
export type { RadioProps as RemoteRadioElementProps } from "@mittwald/flow-react-components";

export class RemoteRadioElement extends FlowRemoteElement<RemoteRadioElementProps> {
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
    "flr-radio": InstanceType<typeof RemoteRadioElement>;
  }
}

customElements.define("flr-radio", RemoteRadioElement);
