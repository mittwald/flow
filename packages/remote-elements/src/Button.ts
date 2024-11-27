import { createRemoteElement } from "@remote-dom/core/elements";
import type { ButtonProps } from "@mittwald/flow-react-components/Button";
import type { RemoteEvent } from "@remote-dom/core/elements";

export type { ButtonProps } from "@mittwald/flow-react-components/Button";

export const RemoteButtonElement = createRemoteElement<ButtonProps>({
  events: {
    press: {
      dispatchEvent: (event: RemoteEvent) => {
        const c = new CustomEvent(event.type);
        console.log(event.detail);
        Object.entries(event.detail ?? {}).forEach(([key, value]) => {
          Object.assign(c, key, value);
        });

        console.log(c);
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
