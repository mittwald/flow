import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Content.module.css";
import clsx from "clsx";
import { ClearPropsContext, useProps } from "@/lib/propsContext";

export interface ContentProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {}

export const Content: FC<ContentProps> = (props) => {
  const { children, className, ...rest } = useProps("content", props);

  const rootClassName = clsx(className, styles.root);

  return (
    <div {...rest} className={rootClassName}>
      <ClearPropsContext>{children}</ClearPropsContext>
    </div>
  );
};

export default Content;
