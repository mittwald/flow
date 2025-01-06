/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SwitchProps } from "@mittwald/flow-react-components/Switch";
export type { SwitchProps } from "@mittwald/flow-react-components/Switch";

export class RemoteSwitchElement extends FlowRemoteElement<SwitchProps> {
  static get remoteProperties() {
    return {
      labelPosition: {},
      isDisabled: {},
      isReadOnly: {},
      autoFocus: {},
      value: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      name: {},
      className: {},
      style: {},
      slot: {},
      "aria-controls": {},
      excludeFromTabOrder: {},
      defaultSelected: {},
      isSelected: {},
      inputRef: {},
      children: {},
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
      change: {},
      hoverStart: {},
      hoverEnd: {},
      hoverChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-switch": InstanceType<typeof RemoteSwitchElement>;
  }
}

customElements.define("flr-switch", RemoteSwitchElement);
