/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { InitialsProps } from "@mittwald/flow-react-components/Initials";
export type { InitialsProps } from "@mittwald/flow-react-components/Initials";

export class RemoteInitialsElement extends FlowRemoteElement<InitialsProps> {
  static get remoteProperties() {
    return {
      children: {},
      className: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-initials": InstanceType<typeof RemoteInitialsElement>;
  }
}

customElements.define("flr-initials", RemoteInitialsElement);
