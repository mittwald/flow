/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FileFieldProps as RemoteFileFieldElementProps } from "@mittwald/flow-react-components/FileField";
export type { FileFieldProps as RemoteFileFieldElementProps } from "@mittwald/flow-react-components/FileField";

export class RemoteFileFieldElement extends FlowRemoteElement<RemoteFileFieldElementProps> {
  static get remoteProperties() {
    return {
      name: {},
      accept: {},
      multiple: {},
      validationBehavior: {},
      isDisabled: {},
      isRequired: {},
      isInvalid: {},
    };
  }

  static get remoteEvents() {
    return {
      change: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-file-field": InstanceType<typeof RemoteFileFieldElement>;
  }
}

customElements.define("flr-file-field", RemoteFileFieldElement);
