/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SkeletonViewProps as RemoteSkeletonViewElementProps } from "@mittwald/flow-react-components";
export type { SkeletonViewProps as RemoteSkeletonViewElementProps } from "@mittwald/flow-react-components";

export class RemoteSkeletonViewElement extends FlowRemoteElement<RemoteSkeletonViewElementProps> {
  static override get remoteAttributes() {
    return ["style"];
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
    "flr-skeleton-view": InstanceType<typeof RemoteSkeletonViewElement>;
  }
}

customElements.define("flr-skeleton-view", RemoteSkeletonViewElement);
