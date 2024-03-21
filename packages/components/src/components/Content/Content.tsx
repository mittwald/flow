import React, { FC, PropsWithChildren } from "react";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import { PropsWithElementType } from "@/lib/types/props";

export interface ContentProps extends PropsWithChildren, PropsWithElementType {}

export const Content: FC<ContentProps> = (props) => {
  const { children, elementType = "div", ...rest } = useProps("Content", props);

  const Element = elementType;

  return (
    <ClearPropsContext>
      <Element {...rest}>{children}</Element>
    </ClearPropsContext>
  );
};

export default Content;
