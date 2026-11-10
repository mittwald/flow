import type { ComponentProps, CSSProperties, PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./InlineCode.module.scss";
import { type AlphaColor, isAlphaColor } from "@/lib/types/props";
import { SkeletonTextContent } from "@/components/SkeletonMode/components/SkeletonTextContent";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface InlineCodeProps
  extends
    PropsWithChildren<Omit<ComponentProps<"code">, "ref">>,
    FlowComponentProps<HTMLElement> {
  /** The color schema of the inline code component. @default "default" */
  color?: "default" | AlphaColor;
  /** The white-space property of the inline code component. @default undefined */
  whiteSpace?: CSSProperties["whiteSpace"];
}

/** @flr-generate all */
export const InlineCode = flowComponent("InlineCode", (props) => {
  const {
    children,
    className,
    color = "default",
    style: styleFromProps,
    whiteSpace,
    ref,
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
      ref={ref}
      style={style}
      className={rootClassName}
      inert={isSkeleton || undefined}
    >
      <SkeletonTextContent defaultWidth="6em">{children}</SkeletonTextContent>
    </code>
  );
});

export default InlineCode;
