import React, {
  ComponentProps,
  createElement,
  FC,
  PropsWithChildren,
} from "react";
import { ClearPropsContext, useProps } from "@/lib/propsContext";

export interface ContentProps extends PropsWithChildren<ComponentProps<"div">> {
  elementType?: string;
}

export const Content: FC<ContentProps> = (props) => {
  const { children, elementType = "div", ...rest } = useProps("Content", props);

  return createElement(elementType, {
    ...rest,
    children: <ClearPropsContext>{children}</ClearPropsContext>,
  });
};

export default Content;
