import { RemoteButtonElement } from "@mittwald/flow-remote-elements";
import { createRemoteComponent } from "@remote-dom/react";

export const Button = createRemoteComponent("flr-button", RemoteButtonElement, {
  eventProps: {
    onPress: {
      event: "press",
    },
  },
});
