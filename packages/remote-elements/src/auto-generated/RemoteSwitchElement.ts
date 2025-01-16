/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { SwitchProps as RemoteSwitchElementProps } from "@mittwald/flow-react-components/Switch";
export type { SwitchProps as RemoteSwitchElementProps } from "@mittwald/flow-react-components/Switch";

export class RemoteSwitchElement extends FlowRemoteElement<RemoteSwitchElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-controls": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
      defaultSelected: {},
      excludeFromTabOrder: {},
      id: {},
      inputRef: {},
      isDisabled: {},
      isReadOnly: {},
      isSelected: {},
      labelPosition: {},
      name: {},
      slot: {},
      value: {},
    };
  }

  static override get remoteEvents() {
    return {
      blur: {},
      change: {},
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
    "flr-switch": InstanceType<typeof RemoteSwitchElement>;
  }
}

customElements.define("flr-switch", RemoteSwitchElement);
