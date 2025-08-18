import { type FC, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./ImageCropper.module.scss";
import { Slider } from "@/components/Slider";
import { getCroppedImage } from "@/components/ImageCropper/lib/getCroppedImage";

interface Props extends PropsWithClassName {
  image?: File | string;
  aspect?: number;
  onCropComplete?: (croppedImage: string) => void;
}

export const ImageCropper: FC<Props> = (props) => {
  const { image, className, aspect = 1, onCropComplete } = props;
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
          const croppedImg = await getCroppedImage(imageSrc, croppedAreaPixels);
          if (onCropComplete) {
            console.log(croppedImg);
            onCropComplete(croppedImg);
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
          aspect={aspect}
          onCropComplete={(_, croppedAreaPixels) =>
            setCroppedAreaPixels(croppedAreaPixels)
          }
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
