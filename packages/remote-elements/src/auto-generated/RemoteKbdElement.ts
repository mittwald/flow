/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { KbdProps } from "@mittwald/flow-react-components";
export type RemoteKbdElementProps = WithSerializableClassName<KbdProps>;

export class RemoteKbdElement extends FlowRemoteElement<RemoteKbdElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      isDisabled: {},
      keys: {},
      variant: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-kbd": InstanceType<typeof RemoteKbdElement>;
  }
}

customElements.define("flr-kbd", RemoteKbdElement);
