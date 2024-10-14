import { createRemoteElement } from "@remote-dom/core/elements";
import type { EmptyObject } from "type-fest";
import type { PickRemoteElementEventListeners } from "@/lib/types";
import type { AlertProps } from "@mittwald/flow-react-components/Alert";

export const RemoteAlertElement = createRemoteElement<
  AlertProps,
  EmptyObject,
  EmptyObject,
  PickRemoteElementEventListeners<AlertProps>
>({
  properties: ["color", "status"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-alert": InstanceType<typeof RemoteAlertElement>;
  }
}

customElements.define("flr-alert", RemoteAlertElement);
