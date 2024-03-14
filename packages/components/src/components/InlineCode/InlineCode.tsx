import React, { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./InlineCode.module.scss";

export interface InlineCodeProps
  extends PropsWithChildren<ComponentProps<"code">> {}

export const InlineCode: FC<InlineCodeProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.inlineCode, className);

  return (
    <code {...rest} className={rootClassName}>
      {children}
    </code>
  );
};

export default InlineCode;
