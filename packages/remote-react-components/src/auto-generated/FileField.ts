/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteFileFieldElement } from "@mittwald/flow-remote-elements";
export { type RemoteFileFieldElement } from "@mittwald/flow-remote-elements";

export const FileField = createFlowRemoteComponent(
  "flr-file-field",
  "FileField",
  RemoteFileFieldElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onChange: { event: "change" } as never,
    },
  },
);
