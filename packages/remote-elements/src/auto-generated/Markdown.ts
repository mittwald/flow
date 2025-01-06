/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MarkdownProps } from "@mittwald/flow-react-components/Markdown";
export type { MarkdownProps } from "@mittwald/flow-react-components/Markdown";

export class RemoteMarkdownElement extends FlowRemoteElement<MarkdownProps> {
  static get remoteProperties() {
    return {
      color: {},
      children: {},
      className: {},
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
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-markdown": InstanceType<typeof RemoteMarkdownElement>;
  }
}

customElements.define("flr-markdown", RemoteMarkdownElement);
