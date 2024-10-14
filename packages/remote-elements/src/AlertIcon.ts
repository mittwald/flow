import { createRemoteElement } from "@remote-dom/core/elements";
import type { EmptyObject } from "type-fest";
import type { PickRemoteElementEventListeners } from "@/lib/types";
import type { AlertIconProps } from "@mittwald/flow-react-components/AlertIcon";

export const RemoteAlertIconElement = createRemoteElement<
  AlertIconProps,
  EmptyObject,
  EmptyObject,
  PickRemoteElementEventListeners<AlertIconProps>
>({
  properties: ["color", "size"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-alert-icon": InstanceType<typeof RemoteAlertIconElement>;
  }
}

customElements.define("flr-alert-icon", RemoteAlertIconElement);
