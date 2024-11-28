import { createRemoteElement } from "@remote-dom/core/elements";
import type { ButtonProps } from "@mittwald/flow-react-components/Button";

export type { ButtonProps } from "@mittwald/flow-react-components/Button";

export const RemoteButtonElement = createRemoteElement<ButtonProps>({
  events: {
    press: {
      dispatchEvent: (event: object) => {
        const { type, ...rest } = event;
        const c = new Event(type);
        Object.assign(c, rest);
        return c;
      },
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
