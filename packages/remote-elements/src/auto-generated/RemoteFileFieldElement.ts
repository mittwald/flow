/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { FileFieldProps } from "@mittwald/flow-react-components";
export type RemoteFileFieldElementProps =
  WithSerializableClassName<FileFieldProps>;

export class RemoteFileFieldElement extends FlowRemoteElement<RemoteFileFieldElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      accept: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      multiple: {},
      name: {},
      validationBehavior: {},
    };
  }

  static override get remoteEvents() {
    return {
      change: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-file-field": InstanceType<typeof RemoteFileFieldElement>;
  }
}

customElements.define("flr-file-field", RemoteFileFieldElement);
