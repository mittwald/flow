import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./InlineCode.module.scss";

export interface InlineCodeProps
  extends PropsWithChildren<ComponentProps<"code">> {
  /** The color schema of the inline code component. */
  color?: "default" | "light" | "dark";
}

/** @flr-generate all */
export const InlineCode: FC<InlineCodeProps> = (props) => {
  const { children, className, color = "default", ...rest } = props;

  const rootClassName = clsx(styles.inlineCode, className, styles[color]);

  return (
    <ClearPropsContextView>
      <code {...rest} className={rootClassName}>
        {children}
      </code>
    </ClearPropsContextView>
  );
};

export default InlineCode;
