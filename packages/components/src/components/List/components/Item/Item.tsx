import React, { PropsWithChildren } from "react";
import styles from "./Item.module.css";

interface Props extends PropsWithChildren {}

export const Item = (props: Props) => {
  const { children } = props;

  return <div className={styles.listItem}>{children}</div>;
};

export default Item;
