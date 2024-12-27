import type { TextFieldProps } from "@mittwald/flow-react-components/TextField";
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { TextFieldProps } from "@mittwald/flow-react-components/TextField";

export class RemoteTextFieldElement extends FlowRemoteElement<TextFieldProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      name: {},
      value: {},
      form: {},
      type: {},
    };
  }

  static get remoteEvents() {
    return {
      change: {},
      blur: {},
      focus: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-field": InstanceType<typeof RemoteTextFieldElement>;
  }
}

customElements.define("flr-text-field", RemoteTextFieldElement);
