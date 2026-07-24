"use client";
import type { FC } from "react";
import { WFrame } from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const TableWireframe: FC = () => (
  <WFrame justifyContent="center">
    <div className={styles.table}>
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          className={index < 3 ? styles.tableHeaderCell : styles.tableCell}
        />
      ))}
    </div>
  </WFrame>
);

export default TableWireframe;
