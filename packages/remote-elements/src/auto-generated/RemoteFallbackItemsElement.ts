/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FallbackItemsProps as RemoteFallbackItemsElementProps } from "@mittwald/flow-react-components";
export type { FallbackItemsProps as RemoteFallbackItemsElementProps } from "@mittwald/flow-react-components";

export class RemoteFallbackItemsElement extends FlowRemoteElement<RemoteFallbackItemsElementProps> {
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
    "flr-fallback-items": InstanceType<typeof RemoteFallbackItemsElement>;
  }
}

customElements.define("flr-fallback-items", RemoteFallbackItemsElement);
