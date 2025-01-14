/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ColumnLayoutProps as RemoteColumnLayoutElementProps } from "@mittwald/flow-react-components/ColumnLayout";
export type { ColumnLayoutProps as RemoteColumnLayoutElementProps } from "@mittwald/flow-react-components/ColumnLayout";

export class RemoteColumnLayoutElement extends FlowRemoteElement<RemoteColumnLayoutElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      columnGap: {},
      gap: {},
      l: {},
      m: {},
      rowGap: {},
      s: {},
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
    "flr-column-layout": InstanceType<typeof RemoteColumnLayoutElement>;
  }
}

customElements.define("flr-column-layout", RemoteColumnLayoutElement);
