/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FragmentProps as RemoteFragmentElementProps } from "@mittwald/flow-react-components/Fragment";
export type { FragmentProps as RemoteFragmentElementProps } from "@mittwald/flow-react-components/Fragment";

export class RemoteFragmentElement extends FlowRemoteElement<RemoteFragmentElementProps> {
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
    "flr-fragment": InstanceType<typeof RemoteFragmentElement>;
  }
}

customElements.define("flr-fragment", RemoteFragmentElement);
