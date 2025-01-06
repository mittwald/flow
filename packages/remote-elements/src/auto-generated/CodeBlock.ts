/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CodeBlockProps } from "@mittwald/flow-react-components/CodeBlock";
export type { CodeBlockProps } from "@mittwald/flow-react-components/CodeBlock";

export class RemoteCodeBlockElement extends FlowRemoteElement<CodeBlockProps> {
  static get remoteProperties() {
    return {
      copyable: {},
      color: {},
      code: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-code-block": InstanceType<typeof RemoteCodeBlockElement>;
  }
}

customElements.define("flr-code-block", RemoteCodeBlockElement);
