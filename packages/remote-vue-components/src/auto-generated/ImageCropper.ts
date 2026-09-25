/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteImageCropperElement } from "@mittwald/flow-remote-elements";
import type { RemoteImageCropperElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteImageCropperElementProps as ImageCropperProps } from "@mittwald/flow-remote-elements";

export const ImageCropper: FlowRemoteVueComponent<
  RemoteImageCropperElementProps,
  "errorView"
> = createFlowRemoteComponent(
  "flr-image-cropper",
  "ImageCropper",
  RemoteImageCropperElement,
  { slots: ["errorView"] },
);
