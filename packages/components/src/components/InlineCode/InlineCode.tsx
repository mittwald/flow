import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./InlineCode.module.scss";
import { ClearPropsContext } from "@/lib/propsContext";

export interface InlineCodeProps
  extends PropsWithChildren<ComponentProps<"code">> {}

export const InlineCode: FC<InlineCodeProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.inlineCode, className);

  return (
    <ClearPropsContext>
      <code {...rest} className={rootClassName}>
        {children}
      </code>
    </ClearPropsContext>
  );
};

export default InlineCode;
