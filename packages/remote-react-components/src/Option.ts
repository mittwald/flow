import { createRemoteComponent } from "@remote-dom/react";
import { RemoteOptionElement } from "@mittwald/flow-remote-elements";

export const Option = createRemoteComponent(
  "flr-option",
  RemoteOptionElement,
  {},
);
