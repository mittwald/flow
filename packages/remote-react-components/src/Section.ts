import { createRemoteComponent } from "@remote-dom/react";
import { RemoteSectionElement } from "@mittwald/flow-remote-elements";

export const Section = createRemoteComponent(
  "flr-section",
  RemoteSectionElement,
  {},
);
