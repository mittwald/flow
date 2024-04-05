import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./BoldTextPlaceholder.module.scss";
import clsx from "clsx";

export interface BoldTextPlaceholderProps
  extends PropsWithChildren<ComponentProps<"span">> {}

export const BoldTextPlaceholder: FC<BoldTextPlaceholderProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.boldTextPlaceholder, className);

  return (
    <span className={rootClassName} {...rest}>
      {children}
      <span className={styles.boldText}>{children}</span>
    </span>
  );
};

export default BoldTextPlaceholder;
