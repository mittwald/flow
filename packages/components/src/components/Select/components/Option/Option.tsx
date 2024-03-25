import React, { FC } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Option.module.scss";

export interface OptionProps extends Aria.ListBoxItemProps {}

export const Option: FC<OptionProps> = (props) => {
  const { className, children, ...rest } = props;

  const rootClassName = clsx(styles.option, className);

  return (
    <Aria.ListBoxItem className={rootClassName} {...rest}>
      {children}
    </Aria.ListBoxItem>
  );
};

export default Option;
