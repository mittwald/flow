import type { Area } from "react-easy-crop";
import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

export function getCroppedImageFile(
  imageSrc: string,
  sourceImage: File | string,
  pixelCrop: Area,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      const isSourceImageJsFile = sourceImage instanceof File;
      const sourceImageName = isSourceImageJsFile
        ? sourceImage.name
        : "cropped-image.png";
      const sourceImageType = isSourceImageJsFile
        ? sourceImage.type
        : "image/png";

      const quality =
        sourceImageType === "image/jpeg"
          ? 0.86
          : sourceImageType === "image/webp"
            ? 0.82
            : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return;
          }

          const file = new File([blob], sourceImageName, {
            type: sourceImageType,
          });
          addAwaitedArrayBuffer(file).then((fileWithArrayBuffer) => {
            resolve(fileWithArrayBuffer);
          });
        },
        sourceImageType,
        quality,
      );
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
}
