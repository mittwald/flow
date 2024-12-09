import { createRemoteComponent } from "@remote-dom/react";
import { RemoteListItemElement } from "@mittwald/flow-remote-elements";

export const ListItem = createRemoteComponent(
  "flr-list-item",
  RemoteListItemElement,
  {},
);
