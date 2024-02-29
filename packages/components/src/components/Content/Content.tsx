import React, { FC, PropsWithChildren } from "react";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import { PropsWithElementType } from "@/lib/types/props";

export interface ContentProps extends PropsWithChildren, PropsWithElementType {}

export const Content: FC<ContentProps> = (props) => {
  const { children, elementType = "div", ...rest } = useProps("Content", props);

  const Element = elementType;

  return (
    <Element {...rest}>
      <ClearPropsContext>{children}</ClearPropsContext>
    </Element>
  );
};

export default Content;
