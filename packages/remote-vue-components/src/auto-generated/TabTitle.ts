/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTabTitleElement } from "@mittwald/flow-remote-elements";
import type { RemoteTabTitleElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTabTitleElementProps as TabTitleProps } from "@mittwald/flow-remote-elements";

export const TabTitle: FlowRemoteVueComponent<RemoteTabTitleElementProps> =
  createFlowRemoteComponent(
    "flr-tab-title",
    "TabTitle",
    RemoteTabTitleElement,
    { booleans: ["hidden", "inert"] },
  );
