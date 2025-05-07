/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TunnelEntryProps as RemoteTunnelEntryElementProps } from "@mittwald/flow-react-components";
export type { TunnelEntryProps as RemoteTunnelEntryElementProps } from "@mittwald/flow-react-components";

export class RemoteTunnelEntryElement extends FlowRemoteElement<RemoteTunnelEntryElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      id: {},
      staticEntryId: {},
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
    "flr-tunnel-entry": InstanceType<typeof RemoteTunnelEntryElement>;
  }
}

customElements.define("flr-tunnel-entry", RemoteTunnelEntryElement);
