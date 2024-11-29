import type { ButtonProps } from "@mittwald/flow-react-components/Button";
import { dispatchFlowRemoteEvent } from "@mittwald/flow-remote-core";
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { ButtonProps } from "@mittwald/flow-react-components/Button";

export class RemoteButtonElement extends FlowRemoteElement<ButtonProps> {
  static get remoteProperties() {
    return {
      color: {},
    };
  }

  static get remoteEvents() {
    return {
      press: {
        dispatchEvent: dispatchFlowRemoteEvent("press"),
      },
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
