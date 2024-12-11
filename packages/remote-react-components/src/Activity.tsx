import { createRemoteComponent } from "@remote-dom/react";
import { RemoteActivityElement } from "@mittwald/flow-remote-elements";

export const Activity = createRemoteComponent(
  "flr-activity",
  RemoteActivityElement,
);
