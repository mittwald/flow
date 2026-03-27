import type { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./InlineCode.module.scss";
import { type AlphaColor, isAlphaColor } from "@/lib/types/props";

export interface InlineCodeProps extends PropsWithChildren<
  ComponentProps<"code">
> {
  /** The color schema of the inline code component. @default "default" */
  color?: "default" | AlphaColor;
}

/** @flr-generate all */
export const InlineCode: FC<InlineCodeProps> = (props) => {
  const { children, className, color = "default", ...rest } = props;

  const rootClassName = clsx(
    styles.inlineCode,
    className,
    isAlphaColor(color) && styles[color],
  );

  return (
    <code {...rest} className={rootClassName}>
      {children}
    </code>
  );
};

export default InlineCode;
