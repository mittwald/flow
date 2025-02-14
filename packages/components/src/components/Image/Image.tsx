import type { ComponentProps } from "react";
import React from "react";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import clsx from "clsx";
import styles from "./Image.module.scss";

export interface ImageProps extends ComponentProps<"img">, FlowComponentProps {
  /** Display the image with border and rounded edges */
  withBorder?: boolean;
}

export const Image = flowComponent("Image", (props) => {
  const { refProp: ref, className, withBorder, ...rest } = props;

  const rootClassName = clsx(withBorder && styles.border, className);

  return (
    <ClearPropsContext>
      <img className={rootClassName} {...rest} ref={ref} />
    </ClearPropsContext>
  );
});

export default Image;
