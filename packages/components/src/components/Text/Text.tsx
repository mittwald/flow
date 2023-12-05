import React, { FC, PropsWithChildren } from "react";
import styles from "./styles.module.css";
import * as Aria from "react-aria-components";

export const Text: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return <Aria.Text className={styles.root}>{children}</Aria.Text>;
};

export default Text;
