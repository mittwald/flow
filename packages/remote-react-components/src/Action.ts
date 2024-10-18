import { createRemoteComponent } from "@remote-dom/react";
import { RemoteActionElement } from "@mittwald/flow-remote-elements";

export const Action = createRemoteComponent("flr-action", RemoteActionElement, {
  eventProps: {
    onAction: {
      event: "action",
    },
  },
});
