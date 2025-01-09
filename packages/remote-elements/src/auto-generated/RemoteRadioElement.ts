/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { RadioProps as RemoteRadioElementProps } from "@mittwald/flow-react-components/RadioGroup";
export type { RadioProps as RemoteRadioElementProps } from "@mittwald/flow-react-components/RadioGroup";

export class RemoteRadioElement extends FlowRemoteElement<RemoteRadioElementProps> {
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
    "flr-radio": InstanceType<typeof RemoteRadioElement>;
  }
}

customElements.define("flr-radio", RemoteRadioElement);
