import React, {
  ComponentProps,
  createElement,
  FC,
  PropsWithChildren,
} from "react";
import styles from "./Content.module.css";
import clsx from "clsx";
import { ClearPropsContext, useProps } from "@/lib/propsContext";

export interface ContentProps extends PropsWithChildren<ComponentProps<"div">> {
  elementType?: string;
}

export const Content: FC<ContentProps> = (props) => {
  const {
    children,
    className,
    elementType = "div",
    ...rest
  } = useProps("content", props);

  const rootClassName = clsx(className, styles.root);

  return createElement(elementType, {
    ...rest,
    className: rootClassName,
    children: <ClearPropsContext>{children}</ClearPropsContext>,
  });
};

export default Content;
