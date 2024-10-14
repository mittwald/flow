import { createRemoteComponent } from "@remote-dom/react";
import { RemoteInputElement } from "@mittwald/flow-remote-elements";

export const Input = createRemoteComponent("flr-input", RemoteInputElement, {
  eventProps: {
    onChange: {
      event: "change",
    },
    onFocus: {
      event: "focus",
    },
    onBlur: {
      event: "blur",
    },
  },
});
