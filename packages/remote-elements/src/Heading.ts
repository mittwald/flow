import { createRemoteElement } from "@remote-dom/core/elements";
import type { PickRemoteElementEventListeners } from "@/lib/types";
import type { HeadingProps } from "@mittwald/flow-react-components/Heading";
export type { HeadingProps } from "@mittwald/flow-react-components/Heading";

export const RemoteHeadingElement = createRemoteElement<
  HeadingProps,
  object,
  object,
  PickRemoteElementEventListeners<HeadingProps>
>({
  properties: ["color"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-heading": InstanceType<typeof RemoteHeadingElement>;
  }
}

customElements.define("flr-heading", RemoteHeadingElement);
