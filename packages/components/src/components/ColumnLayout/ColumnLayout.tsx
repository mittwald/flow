import type { CSSProperties, PropsWithChildren } from "react";
import React from "react";
import styles from "./ColumnLayout.module.scss";
import { getColumns } from "./lib/getColumns";
import clsx from "clsx";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";

type GapSize = "s" | "m" | "l" | "xl";

export interface ColumnLayoutProps<
  T extends keyof HTMLElementTagNameMap = "div" | "ul",
> extends PropsWithChildren,
    PropsWithElementType<T>,
    PropsWithClassName,
    FlowComponentProps<HTMLElementTagNameMap[T]> {
  /** Column layout for container size s. */
  s?: number[];
  /** Column layout for container size m. */
  m?: number[];
  /** Column layout for container size l. */
  l?: number[];
  /**
   * Size of the row and column gap between the content blocks inside the column
   * layout.
   *
   * @default "m"
   */
  gap?: GapSize;
  /** Size of the row gap between the content blocks inside the column layout. */
  rowGap?: GapSize;
  /** Size of the column gap between the content blocks inside the column layout. */
  columnGap?: GapSize;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const ColumnLayout = flowComponent("ColumnLayout", (props) => {
  const {
    children,
    className,
    s,
    m,
    l,
    gap = "m",
    rowGap = gap,
    columnGap = gap,
    elementType = "div",
    "aria-label": ariaLabel,
    ref,
  } = props;

  const columnsS = s ? getColumns(s) : "1fr";
  const columnsM = m ? getColumns(m) : s ? columnsS : "1fr 1fr";
  const columnsL = l ? getColumns(l) : m || s ? columnsM : "1fr 1fr 1fr";

  const style = {
    "--column-layout--columns-s": columnsS,
    "--column-layout--columns-m": columnsM,
    "--column-layout--columns-l": columnsL,
    "--column-layout--row-gap": `var(--column-layout--gap--${rowGap})`,
    "--column-layout--column-gap": `var(--column-layout--gap--${columnGap})`,
  } as CSSProperties;

  const rootClassName = clsx(styles.columnLayoutContainer, className);

  const Element = elementType;

  const propsContext: PropsContext = {
    Section: {
      hideSeparator: true,
    },
  };

  return (
    <div className={rootClassName} style={style}>
      <Element
        ref={ref as never}
        aria-label={ariaLabel}
        className={styles.columnLayout}
      >
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Element>
    </div>
  );
});

export default ColumnLayout;
