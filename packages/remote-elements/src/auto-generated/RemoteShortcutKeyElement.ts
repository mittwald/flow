/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ShortcutKeyProps as RemoteShortcutKeyElementProps } from "@mittwald/flow-react-components";
export type { ShortcutKeyProps as RemoteShortcutKeyElementProps } from "@mittwald/flow-react-components";

export class RemoteShortcutKeyElement extends FlowRemoteElement<RemoteShortcutKeyElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      isDisabled: {},
      keys: {},
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
    "flr-shortcut-key": InstanceType<typeof RemoteShortcutKeyElement>;
  }
}

customElements.define("flr-shortcut-key", RemoteShortcutKeyElement);
