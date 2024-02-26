import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Checkbox.module.scss";
import { Icon } from "@/components/Icon";
import { IconSquare, IconSquareCheck } from "@tabler/icons-react";

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
            tablerIcon={isSelected ? <IconSquareCheck /> : <IconSquare />}
          />
          {children}
        </>
      )}
    </Aria.Checkbox>
  );
};

export default Checkbox;
