/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteImageCropperElement } from "@mittwald/flow-remote-elements";
export { type RemoteImageCropperElement } from "@mittwald/flow-remote-elements";

export const ImageCropper = createFlowRemoteComponent(
  "flr-image-cropper",
  "ImageCropper",
  RemoteImageCropperElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onCropComplete: { event: "cropComplete" } as never,
    },
  },
);
