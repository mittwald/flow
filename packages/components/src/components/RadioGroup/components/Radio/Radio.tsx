import React, { FC, PropsWithChildren } from "react";
import styles from "./Radio.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {}

export const Radio: FC<RadioProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.Radio {...rest} className={rootClassName}>
      {children}
    </Aria.Radio>
  );
};

export default Radio;
