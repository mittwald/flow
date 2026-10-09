import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import clsx from "clsx";
import type { ComponentProps, CSSProperties } from "react";
import styles from "./Image.module.scss";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

/** Aspect ratio of an image skeleton without `aspectRatio`. */
const skeletonAspectRatio = 16 / 9;

/** The `width`/`height` attribute as a CSS length — `"200"` means 200px. */
const toCssLength = (value: number | string | undefined) =>
  typeof value === "string" && /^\d+(\.\d+)?$/.test(value)
    ? Number(value)
    : value;

export interface ImageProps
  extends
    Omit<ComponentProps<"img">, "ref">,
    FlowComponentProps<HTMLImageElement> {
  /** Display the image with a border. */
  withBorder?: boolean;
  /**
   * Display the image with rounded corners.
   *
   * @default true
   */
  withRoundedCorners?: boolean;
  /**
   * The aspect ratio of the images container. Larger images will be centered
   * and their overflow will be hidden.
   */
  aspectRatio?: number;
}

/** @flr-generate all */
export const Image = flowComponent("Image", (props) => {
  const {
    className,
    withBorder,
    withRoundedCorners = true,
    style,
    aspectRatio,
    width,
    height,
    ref,
    ...rest
  } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.image,
    withBorder && styles.border,
    withRoundedCorners && styles.roundedCorners,
    aspectRatio && styles.aspectRatio,
    className,
  );

  /* No `<img>`, so the skeleton issues no request. Without both dimensions
     the aspect ratio sizes it, filling the width when it has neither. */
  if (isSkeleton) {
    const skeletonClassName = clsx(
      styles.image,
      styles.skeleton,
      withBorder && styles.border,
      withRoundedCorners && styles.roundedCorners,
      className,
    );

    const skeletonWidth = toCssLength(width);
    const skeletonHeight = toCssLength(height);

    const skeletonStyle: CSSProperties = {
      ...style,
      aspectRatio: aspectRatio ?? skeletonAspectRatio,
      width:
        skeletonWidth ?? (skeletonHeight === undefined ? "100%" : undefined),
      height: skeletonHeight,
    };

    return (
      <span
        className={skeletonClassName}
        style={skeletonStyle}
        aria-hidden
        inert
      />
    );
  }

  return (
    <img
      ref={ref}
      className={rootClassName}
      style={{
        ...style,
        ...(aspectRatio !== undefined && { aspectRatio }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
      }}
      {...rest}
    />
  );
});

export default Image;
