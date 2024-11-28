import { createRemoteElement } from "@remote-dom/core/elements";
import type { ContentProps } from "@mittwald/flow-react-components/Content";
export type { ContentProps } from "@mittwald/flow-react-components/Content";

export const RemoteContentElement = createRemoteElement<ContentProps>({});

declare global {
  interface HTMLElementTagNameMap {
    "flr-content": InstanceType<typeof RemoteContentElement>;
  }
}

customElements.define("flr-content", RemoteContentElement);
