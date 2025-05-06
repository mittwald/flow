import type { CSSProperties, FC, PropsWithChildren } from "react";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import clsx from "clsx";
import styles from "./Flex.module.scss";

export interface FlexProps
  extends PropsWithChildren,
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
  align?: "start" | "end" | "center";
  /** The justifyContent value of the element. @default "start" */
  justify?: "start" | "end" | "center";
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
  /** The padding top of the element. */
  paddingTop?: "xs" | "s" | "m" | "l" | "xl";
  /** The padding bottom of the element. */
  paddingBottom?: "xs" | "s" | "m" | "l" | "xl";
  /** The padding left of the element. */
  paddingLeft?: "xs" | "s" | "m" | "l" | "xl";
  /** The padding right of the element. */
  paddingRight?: "xs" | "s" | "m" | "l" | "xl";
}

/** @flr-generate all */
export const Flex: FC<FlexProps> = (props) => {
  const {
    children,
    className,
    direction = "row",
    align = "start",
    justify = "start",
    gap,
    columnGap,
    rowGap,
    grow,
    wrap = "nowrap",
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    elementType = "div",
  } = props;

  const rootClassName = clsx(styles.flex, className);

  const Element = elementType;

  return (
    <Element
      className={rootClassName}
      style={{
        flexDirection: direction,
        alignItems:
          align === "end"
            ? "flex-end"
            : align === "start"
              ? "flex-start"
              : align,
        justifyContent:
          justify === "end"
            ? "flex-end"
            : justify === "start"
              ? "flex-start"
              : justify,

        columnGap: columnGap
          ? `var(--size-px--${columnGap})`
          : gap
            ? `var(--size-px--${gap})`
            : undefined,
        rowGap: rowGap
          ? `var(--size-px--${rowGap})`
          : gap
            ? `var(--size-px--${gap})`
            : undefined,
        flexGrow: grow ? 1 : undefined,
        flexWrap: wrap,
        paddingTop: paddingTop
          ? `var(--size-px--${paddingTop})`
          : padding
            ? `var(--size-px--${padding})`
            : undefined,
        paddingBottom: paddingBottom
          ? `var(--size-px--${paddingBottom})`
          : padding
            ? `var(--size-px--${padding})`
            : undefined,
        paddingLeft: paddingLeft
          ? `var(--size-px--${paddingLeft})`
          : padding
            ? `var(--size-px--${padding})`
            : undefined,
        paddingRight: paddingRight
          ? `var(--size-px--${paddingRight})`
          : padding
            ? `var(--size-px--${padding})`
            : undefined,
      }}
    >
      {children}
    </Element>
  );
};
export default Flex;
