/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FileDropZoneProps as RemoteFileDropZoneElementProps } from "@mittwald/flow-react-components";
export type { FileDropZoneProps as RemoteFileDropZoneElementProps } from "@mittwald/flow-react-components";

export class RemoteFileDropZoneElement extends FlowRemoteElement<RemoteFileDropZoneElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      accept: {},
      className: {},
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
