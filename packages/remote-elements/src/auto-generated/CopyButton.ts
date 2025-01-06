/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CopyButtonProps } from "@mittwald/flow-react-components/CopyButton";
export type { CopyButtonProps } from "@mittwald/flow-react-components/CopyButton";

export class RemoteCopyButtonElement extends FlowRemoteElement<CopyButtonProps> {
  static get remoteProperties() {
    return {
      text: {},
      children: {},
      "aria-haspopup": {},
      isDisabled: {},
      autoFocus: {},
      value: {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      excludeFromTabOrder: {},
      id: {},
      type: {},
      name: {},
      style: {},
      className: {},
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
    };
  }

  static get remoteEvents() {
    return {
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
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-copy-button": InstanceType<typeof RemoteCopyButtonElement>;
  }
}

customElements.define("flr-copy-button", RemoteCopyButtonElement);
