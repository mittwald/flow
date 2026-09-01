"use client";
import type { FC } from "react";
import { WFrame } from "@/app/components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const TableWireframe: FC = () => (
  <WFrame>
    <div className={styles.table}>
      <span className={styles.tableHeaderCell} />
      <span className={styles.tableHeaderCell} />
      <span className={styles.tableHeaderCell} />
      <span className={styles.tableCell} />
      <span className={styles.tableCell} />
      <span className={styles.tableCell} />
      <span className={styles.tableCell} />
      <span className={styles.tableCell} />
      <span className={styles.tableCell} />
      <span className={styles.tableCell} />
      <span className={styles.tableCell} />
      <span className={styles.tableCell} />
    </div>
  </WFrame>
);

export default TableWireframe;
