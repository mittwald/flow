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

export interface ImageUploadProps
  extends Pick<CropperProps, "cropShape">,
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
  const [imageSrc, setImageSrc] = useState<string>();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const fileController = FileController.useNew();
  const files = fileController.useFiles();
  const file = files[0];
  const reader = new FileReader();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rootClassName = clsx(styles.imageUpload, className);

  useEffect(() => {
    if (file) {
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setImageSrc(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

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
      {!file && (
        <FileDropZone
          className={styles.fileDropZone}
          controller={fileController}
          acceptedFileTypes={["image/png", "image/jpeg"]}
        />
      )}

      {file && (
        <ImageCropper
          cropShape={cropShape}
          aspect={width / height}
          image={imageSrc}
          onCropComplete={(_, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
          }}
        />
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
