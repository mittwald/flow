import type { CSSProperties, FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ColumnLayout.module.scss";
import { getColumns } from "./lib/getColumns";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";

export interface ColumnLayoutProps
  extends PropsWithChildren,
    PropsWithClassName {
  s?: number[];
  m?: number[];
  l?: number[];
}

export const ColumnLayout: FC<ColumnLayoutProps> = (props) => {
  const { children, className, s, m, l } = props;

  const columnsS = s ? getColumns(s) : undefined;
  const columnsM = m ? getColumns(m) : s ? columnsS : undefined;
  const columnsL = l ? getColumns(l) : m || s ? columnsM : undefined;

  const style = {
    "--column-layout--columns-s": columnsS,
    "--column-layout--columns-m": columnsM,
    "--column-layout--columns-l": columnsL,
  } as CSSProperties;

  const rootClassName = clsx(styles.columnLayoutContainer, className);

  return (
    <div className={rootClassName} style={style}>
      <div className={styles.columnLayout}>{children}</div>
    </div>
  );
};

export default ColumnLayout;
