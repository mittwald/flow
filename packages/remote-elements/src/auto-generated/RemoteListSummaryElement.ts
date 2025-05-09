/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ListSummaryProps as RemoteListSummaryElementProps } from "@mittwald/flow-react-components";
export type { ListSummaryProps as RemoteListSummaryElementProps } from "@mittwald/flow-react-components";

export class RemoteListSummaryElement extends FlowRemoteElement<RemoteListSummaryElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      position: {},
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
    "flr-list-summary": InstanceType<typeof RemoteListSummaryElement>;
  }
}

customElements.define("flr-list-summary", RemoteListSummaryElement);
