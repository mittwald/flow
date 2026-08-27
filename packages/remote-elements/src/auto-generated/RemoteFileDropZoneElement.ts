/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { FileDropZoneProps } from "@mittwald/flow-react-components";
export type RemoteFileDropZoneElementProps =
  WithSerializableClassName<FileDropZoneProps>;

export class RemoteFileDropZoneElement extends FlowRemoteElement<RemoteFileDropZoneElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      accept: {},
      className: {},
      isDisabled: {},
      isReadOnly: {},
      multiple: {},
      name: {},
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
    "flr-file-drop-zone": InstanceType<typeof RemoteFileDropZoneElement>;
  }
}

customElements.define("flr-file-drop-zone", RemoteFileDropZoneElement);
