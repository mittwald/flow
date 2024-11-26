import type { ButtonProps } from "@mittwald/flow-react-components/Button";
import { createRemoteElement } from "@remote-dom/core/elements";
import type { RemoteEvent } from "@remote-dom/core/elements";
export type { ButtonProps } from "@mittwald/flow-react-components/Button";

export const RemoteButtonElement = createRemoteElement<
  ButtonProps,
  never,
  never,
  { press(event: RemoteEvent): void }
>({
  events: ["press"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
