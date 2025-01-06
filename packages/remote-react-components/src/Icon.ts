import { RemoteIconElement } from "@mittwald/flow-remote-elements";
import createFlowRemoteComponent from "@/lib/createFlowRemoteComponent";

export const Icon = createFlowRemoteComponent(
  "flr-icon",
  "Icon",
  RemoteIconElement,
  {},
);
