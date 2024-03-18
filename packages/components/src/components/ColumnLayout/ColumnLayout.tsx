import React, { FC, PropsWithChildren, CSSProperties } from "react";
import styles from "./ColumnLayout.module.scss";
import { getColumns } from "./lib/getColumns";

export interface ColumnLayoutProps extends PropsWithChildren {
  s?: number[];
  m?: number[];
  l?: number[];
}

export const ColumnLayout: FC<ColumnLayoutProps> = (props) => {
  const { children, s, m, l } = props;

  const columnsS = s ? getColumns(s) : undefined;
  const columnsM = m ? getColumns(m) : s ? columnsS : undefined;
  const columnsL = l ? getColumns(l) : m || s ? columnsM : undefined;

  const style = {
    "--column-layout--columns-s": columnsS,
    "--column-layout--columns-m": columnsM,
    "--column-layout--columns-l": columnsL,
  } as CSSProperties;

  return (
    <div className={styles.columnLayoutContainer} style={style}>
      <div className={styles.columnLayout}>{children}</div>
    </div>
  );
};

export default ColumnLayout;
