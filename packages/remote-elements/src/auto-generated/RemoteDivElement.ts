/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { DivProps as RemoteDivElementProps } from "@mittwald/flow-react-components/Div";
export type { DivProps as RemoteDivElementProps } from "@mittwald/flow-react-components/Div";

export class RemoteDivElement extends FlowRemoteElement<RemoteDivElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
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
    "flr-div": InstanceType<typeof RemoteDivElement>;
  }
}

customElements.define("flr-div", RemoteDivElement);
