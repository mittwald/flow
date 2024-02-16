import React, {
  ComponentProps,
  createElement,
  FC,
  PropsWithChildren,
} from "react";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import styles from "./ContentBox.module.scss";
import clsx from "clsx";

export interface ContentBoxProps
  extends PropsWithChildren<ComponentProps<"div">> {
  elementType?: string;
}

export const ContentBox: FC<ContentBoxProps> = (props) => {
  const {
    children,
    className,
    elementType = "div",
    ...rest
  } = useProps("Content", props);

  const rootClassName = clsx(styles.contentBox, className);

  return createElement(elementType, {
    ...rest,
    className: rootClassName,
    children: <ClearPropsContext>{children}</ClearPropsContext>,
  });
};

export default ContentBox;
