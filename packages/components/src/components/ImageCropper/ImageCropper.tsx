import type { FC } from "react";
import React, { useState } from "react";
import type { CropperProps } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/Slider";
import clsx from "clsx";
import styles from "./ImageCropper.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export interface ImageCropperProps
  extends Pick<
      CropperProps,
      "aspect" | "cropShape" | "image" | "onCropComplete"
    >,
    PropsWithClassName {}

export const ImageCropper: FC<ImageCropperProps> = (props) => {
  const {
    aspect = 4 / 3,
    cropShape = "rect",
    image,
    onCropComplete,
    className,
  } = props;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const rootClassName = clsx(styles.imageCropper, className);

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <div className={rootClassName}>
      <div className={styles.cropperContainer}>
        <Cropper
          crop={crop}
          aspect={cropShape === "round" ? 1 : aspect}
          cropShape={cropShape}
          image={image}
          onCropChange={setCrop}
          zoom={zoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <Slider
        aria-label={stringFormatter.format(`imageCropper.zoom`)}
        defaultValue={zoom}
        onChange={(v) => setZoom(v as number)}
        minValue={1}
        maxValue={3}
        step={0.1}
      />
    </div>
  );
};

export default ImageCropper;
