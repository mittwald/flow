import type { ButtonProps } from "@mittwald/flow-react-components/Button";
import { createRemoteElement } from "@remote-dom/core/elements";
import type { EmptyObject } from "type-fest";
import type { PickRemoteElementEventListeners } from "@/lib/types";

export const RemoteButtonElement = createRemoteElement<
  ButtonProps,
  EmptyObject,
  EmptyObject,
  PickRemoteElementEventListeners<ButtonProps>
>({
  properties: ["color", "variant"],
  events: ["press"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
