/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { RadioButtonProps as RemoteRadioButtonElementProps } from "@mittwald/flow-react-components/RadioGroup";
export type { RadioButtonProps as RemoteRadioButtonElementProps } from "@mittwald/flow-react-components/RadioGroup";

export class RemoteRadioButtonElement extends FlowRemoteElement<RemoteRadioButtonElementProps> {
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
    "flr-radio-button": InstanceType<typeof RemoteRadioButtonElement>;
  }
}

customElements.define("flr-radio-button", RemoteRadioButtonElement);
