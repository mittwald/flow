/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { ActionGroupProps } from "@mittwald/flow-react-components";
export type RemoteActionGroupElementProps =
  WithSerializableClassName<ActionGroupProps>;

export class RemoteActionGroupElement extends FlowRemoteElement<RemoteActionGroupElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      preserveOrder: {},
      size: {},
      spacing: {},
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
    "flr-action-group": InstanceType<typeof RemoteActionGroupElement>;
  }
}

customElements.define("flr-action-group", RemoteActionGroupElement);
