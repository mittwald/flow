import { createRemoteComponent } from "@remote-dom/react";
import { RemoteAlertElement } from "@mittwald/flow-remote-elements";

export const Alert = createRemoteComponent("flr-alert", RemoteAlertElement, {});
