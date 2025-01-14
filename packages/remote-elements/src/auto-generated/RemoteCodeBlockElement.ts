/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { CodeBlockProps as RemoteCodeBlockElementProps } from "@mittwald/flow-react-components/CodeBlock";
export type { CodeBlockProps as RemoteCodeBlockElementProps } from "@mittwald/flow-react-components/CodeBlock";

export class RemoteCodeBlockElement extends FlowRemoteElement<RemoteCodeBlockElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      code: {},
      color: {},
      copyable: {},
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
    "flr-code-block": InstanceType<typeof RemoteCodeBlockElement>;
  }
}

customElements.define("flr-code-block", RemoteCodeBlockElement);
