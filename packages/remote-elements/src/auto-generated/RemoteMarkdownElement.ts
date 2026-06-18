/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MarkdownProps as RemoteMarkdownElementProps } from "@mittwald/flow-react-components";
export type { MarkdownProps as RemoteMarkdownElementProps } from "@mittwald/flow-react-components";

export class RemoteMarkdownElement extends FlowRemoteElement<RemoteMarkdownElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      allowElement: {},
      allowedElements: {},
      className: {},
      color: {},
      disallowedElements: {},
      headingOffset: {},
      rehypePlugins: {},
      remarkPlugins: {},
      remarkRehypeOptions: {},
      skipHtml: {},
      unwrapDisallowed: {},
      urlTransform: {},
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
    "flr-markdown": InstanceType<typeof RemoteMarkdownElement>;
  }
}

customElements.define("flr-markdown", RemoteMarkdownElement);
