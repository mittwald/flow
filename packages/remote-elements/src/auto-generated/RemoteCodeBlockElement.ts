/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { CodeBlockProps as RemoteCodeBlockElementProps } from "@mittwald/flow-react-components/CodeBlock";
export type { CodeBlockProps as RemoteCodeBlockElementProps } from "@mittwald/flow-react-components/CodeBlock";

export class RemoteCodeBlockElement extends FlowRemoteElement<RemoteCodeBlockElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      code: {},
      color: {},
      copyable: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-code-block": InstanceType<typeof RemoteCodeBlockElement>;
  }
}

customElements.define("flr-code-block", RemoteCodeBlockElement);
