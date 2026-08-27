/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { BigNumberProps as RemoteBigNumberElementProps } from "@mittwald/flow-react-components";
export type { BigNumberProps as RemoteBigNumberElementProps } from "@mittwald/flow-react-components";

export class RemoteBigNumberElement extends FlowRemoteElement<RemoteBigNumberElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
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
    "flr-big-number": InstanceType<typeof RemoteBigNumberElement>;
  }
}

customElements.define("flr-big-number", RemoteBigNumberElement);
