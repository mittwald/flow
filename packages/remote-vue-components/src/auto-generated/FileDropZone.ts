/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteFileDropZoneElement } from "@mittwald/flow-remote-elements";
import type { RemoteFileDropZoneElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteFileDropZoneElementProps as FileDropZoneProps } from "@mittwald/flow-remote-elements";

export const FileDropZone: FlowRemoteVueComponent<RemoteFileDropZoneElementProps> =
  createFlowRemoteComponent(
    "flr-file-drop-zone",
    "FileDropZone",
    RemoteFileDropZoneElement,
    { booleans: ["isDisabled", "isReadOnly", "multiple"] },
  );
