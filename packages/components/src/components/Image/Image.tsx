import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "./Image.module.scss";

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

  const rootClassName = clsx(
    styles.image,
    withBorder && styles.border,
    withRoundedCorners && styles.roundedCorners,
    aspectRatio && styles.aspectRatio,
    className,
  );

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
