/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FragmentProps } from "@mittwald/flow-react-components/Fragment";
export type { FragmentProps } from "@mittwald/flow-react-components/Fragment";

export class RemoteFragmentElement extends FlowRemoteElement<FragmentProps> {
  static get remoteProperties() {
    return {
      children: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-fragment": InstanceType<typeof RemoteFragmentElement>;
  }
}

customElements.define("flr-fragment", RemoteFragmentElement);
