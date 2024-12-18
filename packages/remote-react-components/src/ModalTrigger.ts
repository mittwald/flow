import { createRemoteComponent } from "@remote-dom/react";
import { RemoteModalTriggerElement } from "@mittwald/flow-remote-elements";

export const ModalTrigger = createRemoteComponent(
  "flr-modal-trigger",
  RemoteModalTriggerElement,
  {},
);
