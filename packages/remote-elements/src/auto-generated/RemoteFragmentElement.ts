/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FragmentProps as RemoteFragmentElementProps } from "@mittwald/flow-react-components";
export type { FragmentProps as RemoteFragmentElementProps } from "@mittwald/flow-react-components";

export class RemoteFragmentElement extends FlowRemoteElement<RemoteFragmentElementProps> {
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
    "flr-fragment": InstanceType<typeof RemoteFragmentElement>;
  }
}

customElements.define("flr-fragment", RemoteFragmentElement);
