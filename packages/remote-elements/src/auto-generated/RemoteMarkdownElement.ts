/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { MarkdownProps } from "@mittwald/flow-react-components";
export type RemoteMarkdownElementProps =
  WithSerializableClassName<MarkdownProps>;

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
