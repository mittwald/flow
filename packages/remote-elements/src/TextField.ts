import type { TextFieldProps } from "@mittwald/flow-react-components/TextField";
import { dispatchFlowRemoteEvent } from "@mittwald/flow-remote-core";
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { TextFieldProps } from "@mittwald/flow-react-components/TextField";

export class RemoteTextFieldElement extends FlowRemoteElement<TextFieldProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
    };
  }

  static get remoteEvents() {
    return {
      change: {
        dispatchEvent: dispatchFlowRemoteEvent("change"),
      },
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-field": InstanceType<typeof RemoteTextFieldElement>;
  }
}

customElements.define("flr-text-field", RemoteTextFieldElement);
