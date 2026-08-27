/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { EmptyViewProps } from "@mittwald/flow-react-components";
export type RemoteListEmptyViewElementProps =
  WithSerializableClassName<EmptyViewProps>;

export class RemoteListEmptyViewElement extends FlowRemoteElement<RemoteListEmptyViewElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {};
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
    "flr-list-empty-view": InstanceType<typeof RemoteListEmptyViewElement>;
  }
}

customElements.define("flr-list-empty-view", RemoteListEmptyViewElement);
