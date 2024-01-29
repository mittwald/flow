import React, { createElement, FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
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

  const textProps = { ...rest, className, children };

  if (!props.slot) {
    return createElement(elementType, textProps);
  }

  return <Aria.Text {...textProps} elementType={elementType} />;
};

export default Text;
