import React, { createElement, FC, PropsWithChildren } from "react";
import styles from "./Text.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface TextProps
  extends PropsWithChildren<Omit<Aria.TextProps, "children">> {}

export const Text: FC<TextProps> = (props) => {
  const {
    children,
    className,
    elementType = "span",
    ...rest
  } = useProps("Text", props);

  const rootClassName = clsx(className, styles.root);

  const textProps = { ...rest, className: rootClassName, children };

  if (!props.slot) {
    return createElement(elementType, textProps);
  }

  return <Aria.Text {...textProps} elementType={elementType} />;
};

export default Text;
