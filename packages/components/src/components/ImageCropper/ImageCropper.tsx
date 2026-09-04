import {
  type CSSProperties,
  type FC,
  type ReactNode,
  useEffect,
  useRef,
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
import { useDebouncedCallback } from "use-debounce";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { IconDanger } from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";

/** Why an {@link ImageCropper} cannot work with the given image. */
export interface ImageCropperError {
  /**
   * `"load"` — the image itself could not be loaded. `"crop"` — the image is
   * displayed, but reading it into a canvas to produce the cropped file failed
   * (a cross-origin image without CORS headers, for example).
   */
  reason: "load" | "crop";
  /** Technical message, meant for logging — not for display. */
  message: string;
}

export interface ImageCropperProps
  extends PropsWithClassName, Partial<Pick<CropperProps, "cropShape">> {
  /** The image file to crop. */
  image?: File | string;
  /** Callback on crop complete. */
  onCropComplete?: (croppedImage: File) => void;
  /**
   * Callback when the image cannot be cropped, because it failed to load or
   * could not be read.
   */
  onError?: (error: ImageCropperError) => void;
  /**
   * View that is shown instead of the cropper when the image cannot be cropped.
   * Defaults to a localized error message.
   */
  errorView?: ReactNode;
  /** The width of the component. @default 300 */
  width?: CSSProperties["width"];
  /** The height of the component. @default 300 */
  height?: CSSProperties["height"];
  /** The aspect ratio of the crop shape. */
  aspectRatio?: number;
}

/**
 * @flr-generate all
 * @flowStatus new
 */
export const ImageCropper: FC<ImageCropperProps> = (props) => {
  const {
    image,
    className,
    onCropComplete,
    onError,
    errorView,
    width = 300,
    height = 300,
    aspectRatio,
    ...rest
  } = props;

  const imageSrc = useImageSrc(image);

  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [error, setError] = useState<ImageCropperError>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  /** Reports every image at most once, no matter how many crops fail on it. */
  const errorReported = useRef(false);

  const stringFormatter = useLocalizedStringFormatter(locales, "ImageCropper");
  const rootClassName = clsx(styles.imageCropper, className);

  const reportError = (
    reason: ImageCropperError["reason"],
    message: string,
  ): void => {
    if (errorReported.current) {
      return;
    }
    errorReported.current = true;

    const imageCropperError: ImageCropperError = { reason, message };
    setError(imageCropperError);
    onError?.(imageCropperError);
  };

  const debouncedCropComplete = useDebouncedCallback(
    async (croppedAreaPixels: Area) => {
      if (!croppedAreaPixels) {
        return;
      }

      let croppedImageFile: File;

      try {
        croppedImageFile = await getCroppedImageFile(
          imageSrc,
          image ?? "",
          croppedAreaPixels,
        );
      } catch (cause) {
        reportError(
          "crop",
          cause instanceof Error ? cause.message : String(cause),
        );
        return;
      }

      onCropComplete?.(croppedImageFile);
    },
    500,
    {
      leading: true,
    },
  );

  useEffect(() => {
    setMediaLoaded(false);
    setError(undefined);
    errorReported.current = false;
  }, [imageSrc]);

  const defaultErrorView = (
    <IllustratedMessage color="danger">
      <IconDanger />
      <Text>{stringFormatter.format("error.text")}</Text>
    </IllustratedMessage>
  );

  const errorElement = error ? (errorView ?? defaultErrorView) : undefined;

  return (
    <div className={rootClassName} style={{ width }}>
      <div className={styles.cropperContainer} style={{ height }}>
        {errorElement ? (
          <div className={styles.errorViewContainer}>{errorElement}</div>
        ) : (
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
            mediaProps={{
              onError: () =>
                reportError("load", `Failed to load image "${imageSrc}"`),
            }}
            onMediaLoaded={() => setMediaLoaded(true)}
            onCropComplete={(_, croppedAreaPixels) => {
              if (mediaLoaded) {
                debouncedCropComplete(croppedAreaPixels);
              }
            }}
            {...rest}
          />
        )}
      </div>
      {!errorElement && (
        <Slider
          minValue={1}
          maxValue={3}
          step={0.01}
          value={zoom}
          sliderOnly
          onChange={(zoom) => setZoom(zoom as number)}
          aria-label={stringFormatter.format("zoom")}
        />
      )}
    </div>
  );
};

export default ImageCropper;
