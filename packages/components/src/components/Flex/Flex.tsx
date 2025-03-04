import type { CSSProperties, FC, PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./Flex.module.scss";

export interface FlexProps extends PropsWithChildren, PropsWithClassName {
  direction?: CSSProperties["flexDirection"];
  align?: "start" | "end" | "center";
  justify?: "start" | "end" | "center";
  gap?: "xs" | "s" | "m" | "l" | "xl";
  columnGap?: "xs" | "s" | "m" | "l" | "xl";
  rowGap?: "xs" | "s" | "m" | "l" | "xl";
  grow?: boolean;
  wrap?: CSSProperties["flexWrap"];
}

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
    wrap,
  } = props;

  const rootClassName = clsx(styles.flex, className);

  return (
    <div
      className={rootClassName}
      style={{
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap: gap ? `var(--size-px--${gap})` : undefined,
        columnGap: columnGap ? `var(--size-px--${columnGap})` : undefined,
        rowGap: rowGap ? `var(--size-px--${rowGap})` : undefined,
        flexGrow: grow ? 1 : 0,
        flexWrap: wrap,
      }}
    >
      {children}
    </div>
  );
};
