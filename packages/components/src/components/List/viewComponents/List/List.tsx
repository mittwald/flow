import type { FC, PropsWithChildren, Ref } from "react";
import React from "react";
import styles from "./List.module.css";

type Props = PropsWithChildren & {
  ref?: Ref<HTMLDivElement>;
};

export const List: FC<Props> = (props) => {
  const { children, ref } = props;

  return (
    <div className={styles.list} ref={ref}>
      {children}
    </div>
  );
};

export default List;
