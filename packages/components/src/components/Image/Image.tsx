import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { ClearPropsContext } from "@/lib/propsContext";
import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "./Image.module.scss";

export interface ImageProps extends ComponentProps<"img">, FlowComponentProps {
  /** Display the image with border and rounded edges */
  withBorder?: boolean;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Image = flowComponent("Image", (props) => {
  const { className, withBorder, ...rest } = props;

  const rootClassName = clsx(withBorder && styles.border, className);

  return (
    <ClearPropsContext>
      <img className={rootClassName} {...rest} />
    </ClearPropsContext>
  );
});

export default Image;
