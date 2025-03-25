/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ColorProps as RemoteColorElementProps } from "@mittwald/flow-react-components";
export type { ColorProps as RemoteColorElementProps } from "@mittwald/flow-react-components";

export class RemoteColorElement extends FlowRemoteElement<RemoteColorElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      color: {},
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
    "flr-color": InstanceType<typeof RemoteColorElement>;
  }
}

customElements.define("flr-color", RemoteColorElement);
