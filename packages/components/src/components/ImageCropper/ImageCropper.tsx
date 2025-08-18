import { type FC, useEffect, useState } from "react";
import Cropper, { type Area, type CropperProps } from "react-easy-crop";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./ImageCropper.module.scss";
import { Slider } from "@/components/Slider";
import { getCroppedImageFile } from "@/components/ImageCropper/lib/getCroppedImageFile";

interface Props
  extends PropsWithClassName,
    Pick<CropperProps, "aspect" | "cropShape"> {
  image?: File | string;
  onCropComplete?: (croppedImage: File) => void;
}

export const ImageCropper: FC<Props> = (props) => {
  const { image, className, onCropComplete, ...rest } = props;
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const rootClassName = clsx(styles.imageCropper, className);

  useEffect(() => {
    if (image) {
      if (typeof image === "string") {
        setImageSrc(image);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImageSrc(reader.result);
          }
        };
        reader.readAsDataURL(image);
      }
    }
  }, [image]);

  useEffect(() => {
    async function crop() {
      if (croppedAreaPixels) {
        try {
          const croppedImageFile = await getCroppedImageFile(
            imageSrc,
            croppedAreaPixels,
          );
          if (onCropComplete) {
            onCropComplete(croppedImageFile);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    void crop();
  }, [croppedAreaPixels]);

  return (
    <div className={rootClassName}>
      <div className={styles.cropperContainer}>
        <Cropper
          crop={crop}
          image={imageSrc}
          onCropChange={setCrop}
          zoom={zoom}
          onZoomChange={setZoom}
          onCropComplete={(_, croppedAreaPixels) =>
            setCroppedAreaPixels(croppedAreaPixels)
          }
          {...rest}
        />
      </div>
      <Slider
        minValue={1}
        maxValue={3}
        step={0.1}
        value={zoom}
        onChange={(zoom) => setZoom(zoom as number)}
      >
        x Zoom
      </Slider>
    </div>
  );
};

export default ImageCropper;
