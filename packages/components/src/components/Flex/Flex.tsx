import type { CSSProperties, FC, PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./Flex.module.scss";

export interface FlexProps extends PropsWithChildren, PropsWithClassName {
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
  } = props;

  const rootClassName = clsx(styles.flex, className);

  return (
    <div
      className={rootClassName}
      style={{
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,

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
      }}
    >
      {children}
    </div>
  );
};
export default Flex;
