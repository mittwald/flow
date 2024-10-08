import type { CSSProperties, FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ColumnLayout.module.scss";
import { getColumns } from "./lib/getColumns";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";

type GapSize = "s" | "m" | "l";

export interface ColumnLayoutProps
  extends PropsWithChildren,
    PropsWithClassName {
  s?: number[];
  m?: number[];
  l?: number[];
  gap?: GapSize;
  rowGap?: GapSize;
  columnGap?: GapSize;
}

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

  return (
    <div className={rootClassName} style={style}>
      <div className={styles.columnLayout}>{children}</div>
    </div>
  );
};

export default ColumnLayout;
