/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { CodeBlockProps } from "@mittwald/flow-react-components/CodeBlock";
export type { CodeBlockProps } from "@mittwald/flow-react-components/CodeBlock";

export const RemoteCodeBlockElement = createRemoteElement<CodeBlockProps>({
  properties: {
    copyable: {},
    color: {},
    code: {},
    className: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-code-block": InstanceType<typeof RemoteCodeBlockElement>;
  }
}

customElements.define("flr-code-block", RemoteCodeBlockElement);
