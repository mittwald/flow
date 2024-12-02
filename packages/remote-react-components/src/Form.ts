import { createRemoteComponent } from "@remote-dom/react";
import { RemoteFormElement } from "@mittwald/flow-remote-elements";

export const Form = createRemoteComponent("flr-form", RemoteFormElement, {
  eventProps: {
    onSubmit: { event: "submit" } as never,
  },
});
