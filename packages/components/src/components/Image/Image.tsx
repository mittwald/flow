import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "./Image.module.scss";

export interface ImageProps extends ComponentProps<"img">, FlowComponentProps {
  /** Display the image with border and rounded edges */
  withBorder?: boolean;
}

/** @flr-generate all */
export const Image = flowComponent("Image", (props) => {
  const { className, withBorder, ...rest } = props;

  const rootClassName = clsx(withBorder && styles.border, className);

  return (
    <ClearPropsContextView>
      <img className={rootClassName} {...rest} />
    </ClearPropsContextView>
  );
});

export default Image;
