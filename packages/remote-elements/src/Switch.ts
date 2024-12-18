/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { SwitchProps } from "@mittwald/flow-react-components/Switch";
export type { SwitchProps } from "@mittwald/flow-react-components/Switch";

export const RemoteSwitchElement = createRemoteElement<SwitchProps>({
  properties: {
    labelPosition: {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    className: {},
    style: {},
    isDisabled: {},
    isReadOnly: {},
    autoFocus: {},
    value: {},
    excludeFromTabOrder: {},
    id: {},
    name: {},
    slot: {},
    "aria-controls": {},
    defaultSelected: {},
    isSelected: {},
    inputRef: {},
    children: {},
    wrapWith: {},
    ref: {},
    key: {},
  },
  events: {
    focus: {},
    blur: {},
    focusChange: {},
    keyDown: {},
    keyUp: {},
    change: {},
    hoverStart: {},
    hoverEnd: {},
    hoverChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-switch": InstanceType<typeof RemoteSwitchElement>;
  }
}

customElements.define("flr-switch", RemoteSwitchElement);
