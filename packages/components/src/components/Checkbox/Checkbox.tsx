import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Checkbox.module.css";
import { Icon } from "@/components/Icon";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons/faCheckSquare";
import { faSquare } from "@fortawesome/free-regular-svg-icons/faSquare";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface CheckboxProps
  extends PropsWithChildren<Omit<Aria.CheckboxProps, "children">> {}

export const Checkbox: FC<CheckboxProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    text: {
      className: styles.label,
    },
    content: {
      className: styles.content,
    },
  };

  return (
    <Aria.Checkbox {...rest} className={rootClassName}>
      <Icon className={styles.checked} faIcon={faCheckSquare} />
      <Icon className={styles.unchecked} faIcon={faSquare} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.Checkbox>
  );
};

export default Checkbox;
