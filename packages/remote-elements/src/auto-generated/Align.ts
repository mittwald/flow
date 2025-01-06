/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AlignProps } from "@mittwald/flow-react-components/Align";
export type { AlignProps } from "@mittwald/flow-react-components/Align";

export class RemoteAlignElement extends FlowRemoteElement<AlignProps> {
  static get remoteProperties() {
    return {
      children: {},
      className: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-align": InstanceType<typeof RemoteAlignElement>;
  }
}

customElements.define("flr-align", RemoteAlignElement);
