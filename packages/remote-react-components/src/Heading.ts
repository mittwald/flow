import { createRemoteComponent } from "@remote-dom/react";
import { RemoteHeadingElement } from "@mittwald/flow-remote-elements";

export const Heading = createRemoteComponent(
  "flr-heading",
  RemoteHeadingElement,
  {},
);
