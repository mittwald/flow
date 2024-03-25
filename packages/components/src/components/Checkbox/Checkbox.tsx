import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Checkbox.module.scss";
import { IconChecked, IconUnchecked } from "@/components/Icon/components/icons";
import { ClearPropsContext } from "@/lib/propsContext";

export interface CheckboxProps
  extends PropsWithChildren<Omit<Aria.CheckboxProps, "children">> {}

export const Checkbox: FC<CheckboxProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.checkbox, className);

  return (
    <ClearPropsContext>
      <Aria.Checkbox {...rest} className={rootClassName}>
        {({ isSelected }) => (
          <>
            {isSelected ? (
              <IconChecked className={styles.icon} />
            ) : (
              <IconUnchecked className={styles.icon} />
            )}
            {children}
          </>
        )}
      </Aria.Checkbox>
    </ClearPropsContext>
  );
};

export default Checkbox;
