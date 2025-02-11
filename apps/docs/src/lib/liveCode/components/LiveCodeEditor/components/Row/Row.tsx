import type { FC, PropsWithChildren } from "react";
import styles from "./Row.module.css";

export const Row: FC<PropsWithChildren> = (props) => (
  <div className={styles.row}>{props.children}</div>
);
