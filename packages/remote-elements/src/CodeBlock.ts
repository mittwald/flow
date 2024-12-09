import { createRemoteElement } from "@remote-dom/core/elements";
import type { CodeBlockProps } from "@mittwald/flow-react-components/CodeBlock";
export type { CodeBlockProps } from "@mittwald/flow-react-components/CodeBlock";

export const RemoteCodeBlockElement = createRemoteElement<CodeBlockProps>({
  properties: {
    code: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-code-block": InstanceType<typeof RemoteCodeBlockElement>;
  }
}

customElements.define("flr-code-block", RemoteCodeBlockElement);
