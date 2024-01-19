import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Checkbox.module.scss";
import { Icon } from "@/components/Icon";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons/faCheckSquare";
import { faSquare } from "@fortawesome/free-regular-svg-icons/faSquare";

export interface CheckboxProps
  extends PropsWithChildren<Omit<Aria.CheckboxProps, "children">> {}

export const Checkbox: FC<CheckboxProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.checkbox, className);

  return (
    <Aria.Checkbox {...rest} className={rootClassName}>
      {({ isSelected }) => (
        <>
          <Icon
            className={styles.checkmark}
            faIcon={isSelected ? faCheckSquare : faSquare}
          />
          {children}
        </>
      )}
    </Aria.Checkbox>
  );
};

export default Checkbox;
