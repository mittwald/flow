import {
  type CSSProperties,
  type FC,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import Cropper, { type Area, type CropperProps } from "react-easy-crop";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./ImageCropper.module.scss";
import { Slider } from "@/components/Slider";
import { getCroppedImageFile } from "@/components/ImageCropper/lib/getCroppedImageFile";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "./locales/*.locale.json";
import { useImageSrc } from "@/lib/hooks/useImageSrc";

export interface ImageCropperProps
  extends PropsWithClassName, Partial<Pick<CropperProps, "cropShape">> {
  /** The image file to crop. */
  image?: File | string;
  /** Callback on crop complete. */
  onCropComplete?: (croppedImage: File) => void;
  /** The width of the component. @default 300 */
  width?: CSSProperties["width"];
  /** The height of the component. @default 300 */
  height?: CSSProperties["height"];
  /** The aspect ratio of the crop shape. */
  aspectRatio?: number;
}

/** @flr-generate all */
export const ImageCropper: FC<ImageCropperProps> = (props) => {
  const {
    image,
    className,
    onCropComplete,
    width = 300,
    height = 300,
    aspectRatio,
    ...rest
  } = props;

  const imageSrc = useImageSrc(image);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const rootClassName = clsx(styles.imageCropper, className);

  const stringFormatter = useLocalizedStringFormatter(locales, "ImageCropper");

  const onCropAreaPixelsChange = useEffectEvent(async () => {
    if (croppedAreaPixels) {
      const croppedImageFile = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
      );
      if (onCropComplete) {
        onCropComplete(croppedImageFile);
      }
    }
  });

  useEffect(() => {
    void onCropAreaPixelsChange();
  }, [croppedAreaPixels]);

  return (
    <div className={rootClassName} style={{ width }}>
      <div className={styles.cropperContainer} style={{ height }}>
        <Cropper
          style={{
            containerStyle: {
              borderRadius: "calc(var(--image-cropper--corner-radius) - 1px)",
            },
          }}
          aspect={aspectRatio}
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
        step={0.01}
        value={zoom}
        sliderOnly
        onChange={(zoom) => setZoom(zoom as number)}
        aria-label={stringFormatter.format("zoom")}
      />
    </div>
  );
};

export default ImageCropper;
