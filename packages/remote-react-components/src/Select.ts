import { createRemoteComponent } from "@remote-dom/react";
import { RemoteSelectElement } from "@mittwald/flow-remote-elements";

export const Select = createRemoteComponent(
  "flr-select",
  RemoteSelectElement,
  {},
);
