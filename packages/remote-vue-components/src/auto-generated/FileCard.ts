/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteFileCardElement } from "@mittwald/flow-remote-elements";
import type { RemoteFileCardElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteFileCardElementProps as FileCardProps } from "@mittwald/flow-remote-elements";

export const FileCard: FlowRemoteVueComponent<RemoteFileCardElementProps> =
  createFlowRemoteComponent(
    "flr-file-card",
    "FileCard",
    RemoteFileCardElement,
    {
      booleans: [
        "aria-checked",
        "aria-current",
        "aria-haspopup",
        "aria-invalid",
        "aria-pressed",
        "autoFocus",
        "defaultChecked",
        "download",
        "hidden",
        "inert",
        "isFailed",
        "itemScope",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
      ],
    },
  );
