import React, { createElement, FC, PropsWithChildren } from "react";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import { PropsWithElementType } from "@/lib/types/props";

export interface ContentProps
  extends PropsWithChildren,
    PropsWithElementType<"div"> {}

export const Content: FC<ContentProps> = (props) => {
  const { children, elementType = "div", ...rest } = useProps("Content", props);

  return createElement(elementType, {
    ...rest,
    children: <ClearPropsContext>{children}</ClearPropsContext>,
  });
};

export default Content;
