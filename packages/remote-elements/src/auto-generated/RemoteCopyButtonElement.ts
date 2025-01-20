/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { CopyButtonProps as RemoteCopyButtonElementProps } from "@mittwald/flow-react-components/CopyButton";
export type { CopyButtonProps as RemoteCopyButtonElementProps } from "@mittwald/flow-react-components/CopyButton";

export class RemoteCopyButtonElement extends FlowRemoteElement<RemoteCopyButtonElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-controls": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-disabled": {},
      "aria-expanded": {},
      "aria-haspopup": {},
      "aria-labelledby": {},
      "aria-pressed": {},
      ariaSlot: {},
      autoFocus: {},
      className: {},
      color: {},
      excludeFromTabOrder: {},
      form: {},
      formAction: {},
      formEncType: {},
      formMethod: {},
      formNoValidate: {},
      formTarget: {},
      id: {},
      isDisabled: {},
      isFailed: {},
      isPending: {},
      isSucceeded: {},
      name: {},
      preventFocusOnPress: {},
      size: {},
      slot: {},
      type: {},
      unstyled: {},
      value: {},
      variant: {},
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
      pressChange: {},
      pressEnd: {},
      pressStart: {},
      pressUp: {},
    };
  }

  static override get remoteSlots() {
    return ["text"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-copy-button": InstanceType<typeof RemoteCopyButtonElement>;
  }
}

customElements.define("flr-copy-button", RemoteCopyButtonElement);
