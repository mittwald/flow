import React, { FC, PropsWithChildren } from "react";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import styles from "./ContentBox.module.scss";
import clsx from "clsx";
import { PropsWithElementType } from "@/lib/types/props";

export interface ContentBoxProps
  extends PropsWithChildren,
    PropsWithElementType {}

export const ContentBox: FC<ContentBoxProps> = (props) => {
  const {
    children,
    className,
    elementType = "div",
    ...rest
  } = useProps("ContentBox", props);

  const rootClassName = clsx(styles.contentBox, className);

  const Element = elementType;

  return (
    <Element className={rootClassName} {...rest}>
      <ClearPropsContext>{children}</ClearPropsContext>
    </Element>
  );
};

export default ContentBox;
