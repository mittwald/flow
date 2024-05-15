import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./EmulatedBoldText.module.scss";
import clsx from "clsx";

export type EmulatedBoldTextProps = PropsWithChildren<ComponentProps<"span">>;

export const EmulatedBoldText: FC<EmulatedBoldTextProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.emulatedBoldText, className);

  return (
    <span className={rootClassName} {...rest}>
      {children}
      <span aria-hidden="true" className={styles.boldText}>
        {children}
      </span>
    </span>
  );
};

export default EmulatedBoldText;
