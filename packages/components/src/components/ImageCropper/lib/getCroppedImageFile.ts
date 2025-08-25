import type { Area } from "react-easy-crop";

export function getCroppedImageFile(
  imageSrc: string,
  pixelCrop: Area,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

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

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        const file = new File([blob], "cropped-image.png", {
          type: "image/png",
        });
        resolve(file);
      }, "image/png");
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
}
