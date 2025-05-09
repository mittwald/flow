import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "./Image.module.scss";

export interface ImageProps
  extends Omit<ComponentProps<"img">, "ref">,
    FlowComponentProps<HTMLImageElement> {
  /** Display the image with border and rounded edges. */
  withBorder?: boolean;
  /**
   * The aspect ratio of the images container. Larger images will be centered
   * and their overflow will be hidden.
   */
  aspectRatio?: number;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Image = flowComponent("Image", (props) => {
  const {
    className,
    withBorder,
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
    aspectRatio && styles.aspectRatio,
    className,
  );

  return (
    <ClearPropsContext>
      <img
        ref={ref}
        className={rootClassName}
        style={{ ...style, aspectRatio, width, height }}
        {...rest}
      />
    </ClearPropsContext>
  );
});

export default Image;
