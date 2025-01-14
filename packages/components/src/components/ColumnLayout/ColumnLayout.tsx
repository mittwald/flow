import type { CSSProperties, FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ColumnLayout.module.scss";
import { getColumns } from "./lib/getColumns";
import clsx from "clsx";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "~/lib/types/props";
import type { PropsContext } from "~/lib/propsContext";
import { PropsContextProvider } from "~/lib/propsContext";

type GapSize = "s" | "m" | "l" | "xl";

export interface ColumnLayoutProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "ul">,
    PropsWithClassName {
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

/** @flr-generate all */
export const ColumnLayout: FC<ColumnLayoutProps> = (props) => {
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
  } = props;

  const columnsS = s ? getColumns(s) : undefined;
  const columnsM = m ? getColumns(m) : s ? columnsS : undefined;
  const columnsL = l ? getColumns(l) : m || s ? columnsM : undefined;

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
      <Element aria-label={ariaLabel} className={styles.columnLayout}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Element>
    </div>
  );
};

export default ColumnLayout;
