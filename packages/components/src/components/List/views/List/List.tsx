import type { FC, PropsWithChildren, Ref } from "react";
import React from "react";
import styles from "./List.module.css";

export type ListProps = PropsWithChildren & {
  ref?: Ref<HTMLDivElement>;
};

/** @flr-generate all */
export const List: FC<ListProps> = (props) => {
  const { children, ref } = props;

  return (
    <div className={styles.list} ref={ref}>
      {children}
    </div>
  );
};

export default List;
