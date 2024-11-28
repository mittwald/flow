import { createRemoteComponent } from "@remote-dom/react";
import { RemoteSimpleInputElement } from "@mittwald/flow-remote-elements";

export const SimpleInput = createRemoteComponent(
  "flr-simple-input",
  RemoteSimpleInputElement,
);
