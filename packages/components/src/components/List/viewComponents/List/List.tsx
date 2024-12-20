import type { PropsWithChildren } from "react";
import React, { forwardRef } from "react";
import styles from "./List.module.css";

type Props = PropsWithChildren;

export const List = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children } = props;

  return (
    <div className={styles.list} ref={ref}>
      {children}
    </div>
  );
});

export default List;
