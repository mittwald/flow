/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ButtonProps } from "@mittwald/flow-react-components/Button";
export type { ButtonProps } from "@mittwald/flow-react-components/Button";

export const RemoteButtonElement = createRemoteElement<ButtonProps>({
  properties: {
    slot: {},
    color: {},
    variant: {},
    size: {},
    "aria-disabled": {},
    isPending: {},
    isSucceeded: {},
    isFailed: {},
    unstyled: {},
    ariaSlot: {},
    form: {},
    formAction: {},
    formEncType: {},
    formMethod: {},
    formNoValidate: {},
    formTarget: {},
    name: {},
    value: {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    "aria-haspopup": {},
    isDisabled: {},
    autoFocus: {},
    excludeFromTabOrder: {},
    id: {},
    type: {},
    "aria-controls": {},
    "aria-expanded": {},
    "aria-pressed": {},
    preventFocusOnPress: {},
    children: {},
    className: {},
    style: {},
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
    press: {},
    pressStart: {},
    pressEnd: {},
    pressChange: {},
    pressUp: {},
    hoverStart: {},
    hoverEnd: {},
    hoverChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
