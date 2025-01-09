/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MarkdownProps as RemoteMarkdownElementProps } from "@mittwald/flow-react-components/Markdown";
export type { MarkdownProps as RemoteMarkdownElementProps } from "@mittwald/flow-react-components/Markdown";

export class RemoteMarkdownElement extends FlowRemoteElement<RemoteMarkdownElementProps> {
  static get remoteProperties() {
    return {
      color: {},
      allowElement: {},
      allowedElements: {},
      disallowedElements: {},
      rehypePlugins: {},
      remarkPlugins: {},
      remarkRehypeOptions: {},
      skipHtml: {},
      unwrapDisallowed: {},
      urlTransform: {},
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
    "flr-markdown": InstanceType<typeof RemoteMarkdownElement>;
  }
}

customElements.define("flr-markdown", RemoteMarkdownElement);
