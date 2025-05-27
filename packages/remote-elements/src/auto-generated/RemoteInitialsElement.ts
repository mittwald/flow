/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { InitialsProps as RemoteInitialsElementProps } from "@mittwald/flow-react-components";
export type { InitialsProps as RemoteInitialsElementProps } from "@mittwald/flow-react-components";

export class RemoteInitialsElement extends FlowRemoteElement<RemoteInitialsElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-hidden": {},
      className: {},
      useDynamicColor: {},
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
