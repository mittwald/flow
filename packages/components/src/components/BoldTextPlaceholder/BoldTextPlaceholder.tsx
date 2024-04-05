import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./BoldTextPlaceholder.module.scss";

export interface BoldTextPlaceholderProps
  extends PropsWithChildren<ComponentProps<"div">> {}

export const BoldTextPlaceholder: FC<BoldTextPlaceholderProps> = (props) => {
  const { children } = props;

  return (
    <span className={styles.boldTextPlaceholder}>
      {children}
      <span className={styles.boldText}>{children}</span>
    </span>
  );
};

export default BoldTextPlaceholder;
