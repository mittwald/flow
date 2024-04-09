import type { FC, PropsWithChildren } from "react";
import styles from "./Column.module.css";

export const Column: FC<PropsWithChildren> = (props) => (
  <div className={styles.column}>{props.children}</div>
);
