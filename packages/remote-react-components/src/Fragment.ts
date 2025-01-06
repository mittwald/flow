import { RemoteFragmentElement } from "@mittwald/flow-remote-elements";
import { createRemoteComponent } from "@remote-dom/react";

export const Fragment = createRemoteComponent(
  "flr-fragment",
  RemoteFragmentElement,
  {},
);
