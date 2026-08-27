/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { MenuTriggerProps } from "@mittwald/flow-react-components";
export type RemoteMenuTriggerElementProps =
  WithSerializableClassName<MenuTriggerProps>;

export class RemoteMenuTriggerElement extends FlowRemoteElement<RemoteMenuTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      defaultOpen: {},
      isOpen: {},
      trigger: {},
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
    "flr-menu-trigger": InstanceType<typeof RemoteMenuTriggerElement>;
  }
}

customElements.define("flr-menu-trigger", RemoteMenuTriggerElement);
