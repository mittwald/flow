import { createRemoteElement } from "@remote-dom/core/elements";
import type { AlertProps } from "@mittwald/flow-react-components/Alert";
export type { AlertProps } from "@mittwald/flow-react-components/Alert";

export const RemoteAlertElement = createRemoteElement<AlertProps>({
  properties: {
    color: {},
    status: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-alert": InstanceType<typeof RemoteAlertElement>;
  }
}

customElements.define("flr-alert", RemoteAlertElement);
