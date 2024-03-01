import React, { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./InlineCode.module.scss";

export interface InlineCodeProps
  extends PropsWithChildren<ComponentProps<"span">> {}

export const InlineCode: FC<InlineCodeProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.inlineCode, className);

  return (
    <span {...rest} className={rootClassName}>
      {children}
    </span>
  );
};

export default InlineCode;
