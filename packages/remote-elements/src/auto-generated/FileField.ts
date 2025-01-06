/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FileFieldProps } from "@mittwald/flow-react-components/FileField";
export type { FileFieldProps } from "@mittwald/flow-react-components/FileField";

export class RemoteFileFieldElement extends FlowRemoteElement<FileFieldProps> {
  static get remoteProperties() {
    return {
      children: {},
      wrapWith: {},
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
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-file-field": InstanceType<typeof RemoteFileFieldElement>;
  }
}

customElements.define("flr-file-field", RemoteFileFieldElement);
