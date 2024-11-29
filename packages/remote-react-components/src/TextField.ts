import { RemoteTextFieldElement } from "@mittwald/flow-remote-elements";
import { createRemoteComponent } from "@remote-dom/react";

export const TextField = createRemoteComponent(
  "flr-text-field",
  RemoteTextFieldElement,
  {
    eventProps: {
      onChange: { event: "change" } as never,
    },
  },
);
