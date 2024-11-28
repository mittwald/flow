import { createRemoteElement } from "@remote-dom/core/elements";
import type { ButtonProps } from "@mittwald/flow-react-components/Button";
import { dispatchEvent } from "@/lib/dispatchEvent";

export type { ButtonProps } from "@mittwald/flow-react-components/Button";

export const RemoteButtonElement = createRemoteElement<ButtonProps>({
  events: {
    press: {
      dispatchEvent,
    },
  },
  properties: {
    color: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
