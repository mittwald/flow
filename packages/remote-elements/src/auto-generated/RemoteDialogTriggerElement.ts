/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { DialogTriggerProps as RemoteDialogTriggerElementProps } from "@mittwald/flow-react-components";
export type { DialogTriggerProps as RemoteDialogTriggerElementProps } from "@mittwald/flow-react-components";

export class RemoteDialogTriggerElement extends FlowRemoteElement<RemoteDialogTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      defaultOpen: {},
      isOpen: {},
    };
  }

  static override get remoteEvents() {
    return {
      openChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-dialog-trigger": InstanceType<typeof RemoteDialogTriggerElement>;
  }
}

customElements.define("flr-dialog-trigger", RemoteDialogTriggerElement);
