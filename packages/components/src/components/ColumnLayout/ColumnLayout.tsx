import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import styles from "./ColumnLayout.module.scss";
import { getColumns } from "./lib/getColumns";

export interface ColumnLayoutProps extends PropsWithChildren {
  s?: number[];
  m?: number[];
  l?: number[];
}

// ToDo: In den Docs wird die Größe zu spät erkannt -> Layout springt

export const ColumnLayout: FC<ColumnLayoutProps> = (props) => {
  const { children, s, m, l } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(
    ref.current?.offsetWidth,
  );

  const columnsS = s ? getColumns(s) : "1fr";
  const columnsM = m ? getColumns(m) : s ? columnsS : "1fr 1fr";
  const columnsL = l
    ? getColumns(l)
    : m
      ? columnsM
      : s
        ? columnsS
        : "1fr 1fr 1fr";

  useEffect(() => {
    setWidth(ref.current?.offsetWidth);
    const getWidth = () => {
      setWidth(ref.current?.offsetWidth);
    };
    window.addEventListener("resize", getWidth);
    return () => window.removeEventListener("resize", getWidth);
  }, []);

  return (
    <div
      ref={ref}
      className={styles.columnLayout}
      style={{
        gridTemplateColumns:
          !width || width > 1100 ? columnsL : width < 550 ? columnsM : columnsS,
      }}
    >
      {children}
    </div>
  );
};

export default ColumnLayout;
