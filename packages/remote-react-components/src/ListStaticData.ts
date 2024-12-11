import { createRemoteComponent } from "@remote-dom/react";
import { RemoteListStaticDataElement } from "@mittwald/flow-remote-elements";

export const ListStaticData = createRemoteComponent(
  "flr-list-static-data",
  RemoteListStaticDataElement,
  {},
);
