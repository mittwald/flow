/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTabsElement } from "@mittwald/flow-remote-elements";
import type { RemoteTabsElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTabsElementProps as TabsProps } from "@mittwald/flow-remote-elements";

export const Tabs: FlowRemoteVueComponent<
  RemoteTabsElementProps,
  "tabNotFoundView"
> = createFlowRemoteComponent("flr-tabs", "Tabs", RemoteTabsElement, {
  slots: ["tabNotFoundView"],
});
