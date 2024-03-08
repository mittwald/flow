import React, { FC, PropsWithChildren } from "react";
import styles from "./ColumnLayout.module.scss";
import { getColumns } from "./lib/getColumns";

export interface ColumnLayoutProps extends PropsWithChildren {
  s?: number[];
  m?: number[];
  l?: number[];
}

export const ColumnLayout: FC<ColumnLayoutProps> = (props) => {
  const { children, s, m, l } = props;

  const columnsS = s ? getColumns(s) : "1fr";
  const columnsM = m ? getColumns(m) : s ? columnsS : "1fr 1fr";
  const columnsL = l
    ? getColumns(l)
    : m
      ? columnsM
      : s
        ? columnsS
        : "1fr 1fr 1fr";

  const style = {
    "--column-layout--columns-s": columnsS,
    "--column-layout--columns-m": columnsM,
    "--column-layout--columns-l": columnsL,
  } as React.CSSProperties;

  return (
    <div className={styles.columnLayoutContainer} style={style}>
      <div className={styles.columnLayout}>{children}</div>
    </div>
  );
};

export default ColumnLayout;
