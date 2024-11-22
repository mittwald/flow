import { createRemoteElement } from "@remote-dom/core/elements";
import type { ModalTriggerProps } from "@mittwald/flow-react-components/Modal";
export type { ModalTriggerProps } from "@mittwald/flow-react-components/Modal";

export const RemoteModalTriggerElement = createRemoteElement<ModalTriggerProps>(
  {
    properties: ["isDefaultOpen"],
  },
);

declare global {
  interface HTMLElementTagNameMap {
    "flr-modal-trigger": InstanceType<typeof RemoteModalTriggerElement>;
  }
}

customElements.define("flr-modal-trigger", RemoteModalTriggerElement);
