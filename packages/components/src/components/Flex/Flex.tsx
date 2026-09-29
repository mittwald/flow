import type { CSSProperties, FC, PropsWithChildren } from "react";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import clsx from "clsx";
import styles from "./Flex.module.scss";

export interface FlexProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    PropsWithElementType<
      | "div"
      | "aside"
      | "ul"
      | "li"
      | "ol"
      | "section"
      | "main"
      | "span"
      | "p"
      | "footer"
      | "header"
    > {
  /** The flexDirection value of the element. @default "row" */
  direction?: CSSProperties["flexDirection"];
  /** The alignItems value of the element. @default "start" */
  align?: "start" | "end" | "center" | "stretch" | "baseline";
  /** The justifyContent value of the element. @default "start" */
  justify?: CSSProperties["justifyContent"];
  /** The gap size of the element. */
  gap?: "xs" | "s" | "m" | "l" | "xl";
  /** The columnGap size of the element. */
  columnGap?: "xs" | "s" | "m" | "l" | "xl";
  /** The rowGap size of the element. */
  rowGap?: "xs" | "s" | "m" | "l" | "xl";
  /** Whether the element should grow. */
  grow?: boolean;
  /** The flexWrap value of the element. @default "nowrap" */
  wrap?: CSSProperties["flexWrap"];
  /** The padding of the element. */
  padding?: "xs" | "s" | "m" | "l" | "xl";
  /** The padding top and bottom of the element. Takes precedence over `padding`. */
  paddingBlock?: "xs" | "s" | "m" | "l" | "xl";
  /** The padding left and right of the element. Takes precedence over `padding`. */
  paddingInline?: "xs" | "s" | "m" | "l" | "xl";
  /** The padding top of the element. */
  paddingTop?: "xs" | "s" | "m" | "l" | "xl";
  /** The padding bottom of the element. */
  paddingBottom?: "xs" | "s" | "m" | "l" | "xl";
  /**
   * The padding left of the element – the inline start, so it is on the right
   * under `direction: rtl`.
   */
  paddingLeft?: "xs" | "s" | "m" | "l" | "xl";
  /**
   * The padding right of the element – the inline end, so it is on the left
   * under `direction: rtl`.
   */
  paddingRight?: "xs" | "s" | "m" | "l" | "xl";
}

type FlexSize = "xs" | "s" | "m" | "l" | "xl";

const sizeVariable = (size: FlexSize | undefined) =>
  size && `var(--size-px--${size})`;

/** @flr-generate all */
export const Flex: FC<FlexProps> = (props) => {
  const {
    children,
    className,
    direction = "row",
    align,
    justify,
    gap,
    columnGap,
    rowGap,
    grow,
    wrap = "nowrap",
    padding,
    paddingBlock,
    paddingInline,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    elementType = "div",
    ...restProps
  } = props;

  const columnGapSize = columnGap ?? gap;
  const rowGapSize = rowGap ?? gap;
  const paddingTopSize = paddingTop ?? paddingBlock ?? padding;
  const paddingBottomSize = paddingBottom ?? paddingBlock ?? padding;
  const paddingInlineStartSize = paddingLeft ?? paddingInline ?? padding;
  const paddingInlineEndSize = paddingRight ?? paddingInline ?? padding;

  const rootClassName = clsx(
    styles.flex,
    align && styles.align,
    justify && styles.justify,
    grow && styles.grow,
    columnGapSize && styles["column-gap"],
    rowGapSize && styles["row-gap"],
    paddingTopSize && styles["padding-top"],
    paddingBottomSize && styles["padding-bottom"],
    paddingInlineStartSize && styles["padding-inline-start"],
    paddingInlineEndSize && styles["padding-inline-end"],
    className,
  );

  const style: CSSProperties = {
    "--flex--direction": direction,
    "--flex--wrap": wrap,
    "--flex--align":
      align === "end" ? "flex-end" : align === "start" ? "flex-start" : align,
    "--flex--justify": justify,
    "--flex--column-gap": sizeVariable(columnGapSize),
    "--flex--row-gap": sizeVariable(rowGapSize),
    "--flex--padding-top": sizeVariable(paddingTopSize),
    "--flex--padding-bottom": sizeVariable(paddingBottomSize),
    "--flex--padding-inline-start": sizeVariable(paddingInlineStartSize),
    "--flex--padding-inline-end": sizeVariable(paddingInlineEndSize),
  };

  const Element = elementType;

  return (
    <Element {...restProps} className={rootClassName} style={style}>
      {children}
    </Element>
  );
};
export default Flex;
