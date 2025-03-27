/* prettier-ignore */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export class RemoteSlotRootWrapper extends FlowRemoteElement {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {};
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
    "flr-fragment": InstanceType<typeof RemoteSlotRootWrapper>;
  }
}

customElements.define("flr-slot-root-wrapper", RemoteSlotRootWrapper);
