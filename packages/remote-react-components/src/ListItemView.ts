import { createRemoteComponent } from "@remote-dom/react";
import { RemoteListItemViewElement } from "@mittwald/flow-remote-elements";

export const ListItemView = createRemoteComponent(
  "flr-list-item-view",
  RemoteListItemViewElement,
  {},
);
