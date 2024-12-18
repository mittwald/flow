import { createRemoteElement } from "@remote-dom/core/elements";
import type { AlertIconProps } from "@mittwald/flow-react-components/AlertIcon";
export type { AlertIconProps } from "@mittwald/flow-react-components/AlertIcon";

export const RemoteAlertIconElement = createRemoteElement<AlertIconProps>({
  properties: ["status"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-alert-icon": InstanceType<typeof RemoteAlertIconElement>;
  }
}

customElements.define("flr-alert-icon", RemoteAlertIconElement);
