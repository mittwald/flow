import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./InlineCode.module.scss";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";

export interface InlineCodeProps
  extends PropsWithChildren<ComponentProps<"code">> {
  /** The color schema of the inline code component. */
  color?: "default" | "light" | "dark";
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const InlineCode: FC<InlineCodeProps> = (props) => {
  const { children, className, color = "default", ...rest } = props;

  const rootClassName = clsx(styles.inlineCode, className, styles[color]);

  return (
    <ClearPropsContext>
      <code {...rest} className={rootClassName}>
        {children}
      </code>
    </ClearPropsContext>
  );
};

export default InlineCode;
