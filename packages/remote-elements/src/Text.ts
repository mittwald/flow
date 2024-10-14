import { createRemoteElement } from "@remote-dom/core/elements";
import type { PickRemoteElementEventListeners } from "@/lib/types";
import type { TextProps } from "@mittwald/flow-react-components/Text";
export type { TextProps } from "@mittwald/flow-react-components/Text";

export const RemoteTextElement = createRemoteElement<
  TextProps,
  object,
  object,
  PickRemoteElementEventListeners<TextProps>
>({
  properties: [],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-text": InstanceType<typeof RemoteTextElement>;
  }
}

customElements.define("flr-text", RemoteTextElement);
