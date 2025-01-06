/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WrapProps } from "@mittwald/flow-react-components/Wrap";
export type { WrapProps } from "@mittwald/flow-react-components/Wrap";

export class RemoteWrapElement extends FlowRemoteElement<WrapProps> {
  static get remoteProperties() {
    return {
      if: {},
      children: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-wrap": InstanceType<typeof RemoteWrapElement>;
  }
}

customElements.define("flr-wrap", RemoteWrapElement);
