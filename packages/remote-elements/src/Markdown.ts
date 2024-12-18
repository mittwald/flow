/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { MarkdownProps } from "@mittwald/flow-react-components/Markdown";
export type { MarkdownProps } from "@mittwald/flow-react-components/Markdown";

export const RemoteMarkdownElement = createRemoteElement<MarkdownProps>({
  properties: {
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
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-markdown": InstanceType<typeof RemoteMarkdownElement>;
  }
}

customElements.define("flr-markdown", RemoteMarkdownElement);
