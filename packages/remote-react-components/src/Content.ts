import { createRemoteComponent } from "@remote-dom/react";
import { RemoteContentElement } from "@mittwald/flow-remote-elements";

export const Content = createRemoteComponent(
  "flr-content",
  RemoteContentElement,
  {},
);
