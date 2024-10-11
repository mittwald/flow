import type { FC, PropsWithChildren } from "react";
import styles from "./DetailedInformation.module.scss";

export const DetailedInformation: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return <div className={styles.detailedInformation}>{children}</div>;
};
