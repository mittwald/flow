import React, { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./RadioGroup.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { Label } from "@/components/Label";

export interface RadioGroupProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">> {
  label: ReactNode;
}

export const RadioGroup: FC<RadioGroupProps> = (props) => {
  const { children, className, label, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.RadioGroup {...rest} className={rootClassName}>
      {label && <Label>{label}</Label>}
      {children}
    </Aria.RadioGroup>
  );
};

export default RadioGroup;
