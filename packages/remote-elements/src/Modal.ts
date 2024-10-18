import { createRemoteElement } from "@remote-dom/core/elements";
import type { PickRemoteElementEventListeners } from "@/lib/types";
import type { ModalProps } from "@mittwald/flow-react-components/Modal";
export type { ModalProps } from "@mittwald/flow-react-components/Modal";

export const RemoteModalElement = createRemoteElement<
  ModalProps,
  object,
  object,
  PickRemoteElementEventListeners<ModalProps>
>({
  properties: ["isDismissable", "size", "controller", "offCanvas"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-modal": InstanceType<typeof RemoteModalElement>;
  }
}

customElements.define("flr-modal", RemoteModalElement);
