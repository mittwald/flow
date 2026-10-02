/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SkeletonModeProps as RemoteSkeletonModeElementProps } from "@mittwald/flow-react-components";
export type { SkeletonModeProps as RemoteSkeletonModeElementProps } from "@mittwald/flow-react-components";

export class RemoteSkeletonModeElement extends FlowRemoteElement<RemoteSkeletonModeElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      isEnabled: {},
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
    "flr-skeleton-mode": InstanceType<typeof RemoteSkeletonModeElement>;
  }
}

customElements.define("flr-skeleton-mode", RemoteSkeletonModeElement);
