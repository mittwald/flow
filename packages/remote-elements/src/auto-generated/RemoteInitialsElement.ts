/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { InitialsProps as RemoteInitialsElementProps } from "@mittwald/flow-react-components/Initials";
export type { InitialsProps as RemoteInitialsElementProps } from "@mittwald/flow-react-components/Initials";

export class RemoteInitialsElement extends FlowRemoteElement<RemoteInitialsElementProps> {
  static override get remoteAttributes() {
    return [];
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
    "flr-initials": InstanceType<typeof RemoteInitialsElement>;
  }
}

customElements.define("flr-initials", RemoteInitialsElement);
