/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { RadioProps as RemoteRadioElementProps } from "@mittwald/flow-react-components/RadioGroup";
export type { RadioProps as RemoteRadioElementProps } from "@mittwald/flow-react-components/RadioGroup";

export class RemoteRadioElement extends FlowRemoteElement<RemoteRadioElementProps> {
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
    "flr-radio": InstanceType<typeof RemoteRadioElement>;
  }
}

customElements.define("flr-radio", RemoteRadioElement);
