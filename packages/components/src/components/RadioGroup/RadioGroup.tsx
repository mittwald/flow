import React, { FC, PropsWithChildren } from "react";
import styles from "./RadioGroup.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface RadioGroupProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">> {}

export const RadioGroup: FC<RadioGroupProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.RadioGroup {...rest} className={rootClassName}>
      {children}
    </Aria.RadioGroup>
  );
};

export default RadioGroup;
