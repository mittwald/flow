import { createRemoteElement } from "@remote-dom/core/elements";
import type { HeadingProps } from "@mittwald/flow-react-components/Heading";
export type { HeadingProps } from "@mittwald/flow-react-components/Heading";

export const RemoteHeadingElement = createRemoteElement<HeadingProps>({
  properties: ["color"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-heading": InstanceType<typeof RemoteHeadingElement>;
  }
}

customElements.define("flr-heading", RemoteHeadingElement);
