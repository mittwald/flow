import type { ButtonProps } from "@mittwald/flow-react-components/Button";
import { createRemoteElement } from "@remote-dom/core/elements";
export type { ButtonProps } from "@mittwald/flow-react-components/Button";

export const RemoteButtonElement = createRemoteElement<ButtonProps>({
  properties: ["color", "variant", "type", "isPending"],
  events: ["press"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
