import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";
import { FileDropZone } from "@/components/FileDropZone";
import FileController from "@/components/FileTrigger/FileController";
import { ImageCropper } from "@/components/ImageCropper";
import type { Area, CropperProps } from "react-easy-crop";
import type ImageUploadController from "@/components/ImageUpload/ImageUploadController";
import styles from "./ImageUpload.module.scss";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export interface ImageUploadProps
  extends Partial<Pick<CropperProps, "cropShape">>,
    PropsWithClassName {
  controller: ImageUploadController;
  width?: number;
  height?: number;
}

export const ImageUpload: FC<ImageUploadProps> = (props) => {
  const {
    controller,
    cropShape,
    width = 300,
    height = cropShape === "round" ? 300 : 200,
    className,
  } = props;
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const fileController = FileController.useNew();
  const files = fileController.useFiles();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rootClassName = clsx(styles.imageUpload, className);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const imageSrc = controller.useImageSrc();

  useEffect(() => {
    controller.setImageSrc(files);
  }, [files]);

  useEffect(() => {
    if (canvasRef.current && imageSrc && croppedAreaPixels) {
      controller.drawImage(
        canvasRef.current,
        imageSrc,
        croppedAreaPixels,
        width,
        height,
      );
    }
  }, [imageSrc, croppedAreaPixels]);

  return (
    <div className={rootClassName}>
      {files.length === 0 && (
        <FileDropZone
          className={styles.fileDropZone}
          controller={fileController}
          acceptedFileTypes={["image/png", "image/jpeg"]}
        />
      )}

      {files.length > 0 && (
        <div className={styles.imageCropperContainer}>
          <ImageCropper
            cropShape={cropShape}
            aspect={width / height}
            image={imageSrc}
            onCropComplete={(_, croppedAreaPixels: Area) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
          />
          <Button
            color="secondary"
            variant="plain"
            aria-label={stringFormatter.format("imageUpload.remove")}
            size="s"
            onPress={() => {
              fileController.clear();
              controller.clearCanvas(canvasRef.current);
            }}
          >
            <IconClose />
          </Button>
        </div>
      )}

      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
};

export default ImageUpload;
