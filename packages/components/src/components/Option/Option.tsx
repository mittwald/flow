import { type PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Option.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface OptionProps
  extends Omit<Aria.ListBoxItemProps, "children" | "value" | "id">,
    PropsWithChildren,
    FlowComponentProps {
  value?: string | number;
}

/** @flr-generate all */
export const Option = flowComponent("Option", (props) => {
  const { className, children, value, ref, ...rest } = props;

  const rootClassName = clsx(styles.option, className);

  return (
    <Aria.ListBoxItem
      className={rootClassName}
      ref={ref}
      {...rest}
      id={value}
      key={value}
    >
      {children}
    </Aria.ListBoxItem>
  );
});

export default Option;
