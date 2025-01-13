/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { InitialsProps as RemoteInitialsElementProps } from "@mittwald/flow-react-components/Initials";
export type { InitialsProps as RemoteInitialsElementProps } from "@mittwald/flow-react-components/Initials";

export class RemoteInitialsElement extends FlowRemoteElement<RemoteInitialsElementProps> {
  static get remoteProperties() {
    return {};
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-initials": InstanceType<typeof RemoteInitialsElement>;
  }
}

customElements.define("flr-initials", RemoteInitialsElement);
