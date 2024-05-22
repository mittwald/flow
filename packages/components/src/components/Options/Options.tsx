import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover";
import clsx from "clsx";
import styles from "./Options.module.scss";
import type { OptionProps } from "@/components/Options/components/Option";

export type OptionsProps = Aria.ListBoxProps<OptionProps>;

export const Options: FC<OptionsProps> = (props) => {
  const { className, children, ...rest } = props;

  const rootClassName = clsx(styles.options, className);

  return (
    <Popover className={styles.popover}>
      <Aria.ListBox className={rootClassName} {...rest}>
        {children}
      </Aria.ListBox>
    </Popover>
  );
};

export default Options;
