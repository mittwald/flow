import React, { createElement, FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import { useProps } from "@/lib/propsContext";
import { PropsWithElementType } from "@/lib/types/props";

export interface TextProps
  extends PropsWithChildren,
    Omit<Aria.TextProps, "children" | "elementType">,
    PropsWithElementType<"span"> {}

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
