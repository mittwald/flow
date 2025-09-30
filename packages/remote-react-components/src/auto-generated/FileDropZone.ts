/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteFileDropZoneElement } from "@mittwald/flow-remote-elements";
export { type RemoteFileDropZoneElement } from "@mittwald/flow-remote-elements";

export const FileDropZone = createFlowRemoteComponent(
  "flr-file-drop-zone",
  "FileDropZone",
  RemoteFileDropZoneElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onChange: { event: "change" } as never,
    },
  },
);
