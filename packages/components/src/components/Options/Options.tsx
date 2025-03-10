import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover/Popover";
import clsx from "clsx";
import styles from "./Options.module.scss";
import type { OverlayController } from "@/lib/controller";
import type { OptionProps } from "@/components/Option";

export interface OptionsProps extends Aria.ListBoxProps<OptionProps> {
  controller: OverlayController;
}

export const Options: FC<OptionsProps> = (props) => {
  const { className, children, controller, ...rest } = props;

  const rootClassName = clsx(styles.options, className);

  return (
    <Popover className={styles.popover} controller={controller}>
      <Aria.ListBox className={rootClassName} {...rest}>
        {children}
      </Aria.ListBox>
    </Popover>
  );
};

export default Options;
