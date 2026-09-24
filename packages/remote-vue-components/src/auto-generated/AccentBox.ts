/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteAccentBoxElement } from "@mittwald/flow-remote-elements";
import type { RemoteAccentBoxElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteAccentBoxElementProps as AccentBoxProps } from "@mittwald/flow-remote-elements";

export const AccentBox: FlowRemoteVueComponent<RemoteAccentBoxElementProps> =
  createFlowRemoteComponent(
    "flr-accent-box",
    "AccentBox",
    RemoteAccentBoxElement,
    {
      booleans: [
        "autoFocus",
        "defaultChecked",
        "hidden",
        "inert",
        "itemScope",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
      ],
    },
  );
