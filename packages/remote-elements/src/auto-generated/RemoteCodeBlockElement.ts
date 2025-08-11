/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CodeBlockProps as RemoteCodeBlockElementProps } from "@mittwald/flow-react-components";
export type { CodeBlockProps as RemoteCodeBlockElementProps } from "@mittwald/flow-react-components";

export class RemoteCodeBlockElement extends FlowRemoteElement<RemoteCodeBlockElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      CodeTag: {},
      PreTag: {},
      className: {},
      code: {},
      codeTagProps: {},
      color: {},
      copyable: {},
      customStyle: {},
      language: {},
      lineNumberContainerStyle: {},
      lineNumberStyle: {},
      lineProps: {},
      renderer: {},
      showInlineLineNumbers: {},
      showLineNumbers: {},
      startingLineNumber: {},
      useInlineStyles: {},
      wrapLines: {},
      wrapLongLines: {},
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
