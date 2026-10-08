import type {
  ComponentProps,
  CSSProperties,
  FC,
  PropsWithChildren,
} from "react";
import clsx from "clsx";
import styles from "./InlineCode.module.scss";
import { type AlphaColor, isAlphaColor } from "@/lib/types/props";
import { SkeletonTextContent } from "@/components/SkeletonMode/components/SkeletonTextContent";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export interface InlineCodeProps extends PropsWithChildren<
  ComponentProps<"code">
> {
  /** The color schema of the inline code component. @default "default" */
  color?: "default" | AlphaColor;
  /** The white-space property of the inline code component. @default undefined */
  whiteSpace?: CSSProperties["whiteSpace"];
}

/** @flr-generate all */
export const InlineCode: FC<InlineCodeProps> = (props) => {
  const {
    children,
    className,
    color = "default",
    style: styleFromProps,
    whiteSpace,
    ...rest
  } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.inlineCode,
    isAlphaColor(color) && styles[color],
    className,
  );

  const style = {
    whiteSpace,
    ...styleFromProps,
  };

  return (
    <code
      {...rest}
      style={style}
      className={rootClassName}
      inert={isSkeleton || undefined}
    >
      <SkeletonTextContent defaultWidth="6em">{children}</SkeletonTextContent>
    </code>
  );
};

export default InlineCode;
