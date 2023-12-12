import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Content.module.css";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";

export interface ContentProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {}

export const Content: FC<ContentProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <ClearPropsContext>
      <div {...rest} className={rootClassName}>
        {children}
      </div>
    </ClearPropsContext>
  );
};

export default Content;
