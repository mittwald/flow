/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { CopyButtonProps } from "@mittwald/flow-react-components/CopyButton";
export type { CopyButtonProps } from "@mittwald/flow-react-components/CopyButton";

export const RemoteCopyButtonElement = createRemoteElement<CopyButtonProps>({
  properties: {
    text: {},
    children: {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    className: {},
    style: {},
    "aria-haspopup": {},
    isDisabled: {},
    autoFocus: {},
    value: {},
    excludeFromTabOrder: {},
    id: {},
    type: {},
    name: {},
    slot: {},
    wrapWith: {},
    form: {},
    formAction: {},
    formEncType: {},
    formMethod: {},
    formNoValidate: {},
    formTarget: {},
    size: {},
    color: {},
    "aria-controls": {},
    "aria-disabled": {},
    "aria-expanded": {},
    "aria-pressed": {},
    preventFocusOnPress: {},
    variant: {},
    isPending: {},
    isSucceeded: {},
    isFailed: {},
    unstyled: {},
    ariaSlot: {},
    ref: {},
    key: {},
  },
  events: {
    focus: {},
    blur: {},
    focusChange: {},
    keyDown: {},
    keyUp: {},
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
    "flr-copy-button": InstanceType<typeof RemoteCopyButtonElement>;
  }
}

customElements.define("flr-copy-button", RemoteCopyButtonElement);
