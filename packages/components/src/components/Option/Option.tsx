import { type PropsWithChildren } from "react";
import React, { Children } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Option.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { extractTextFromFirstChild } from "@/lib/react/remote";

export interface OptionProps
  extends
    Omit<Aria.ListBoxItemProps, "children" | "value" | "id">,
    PropsWithChildren,
    FlowComponentProps {
  value?: string | number;
}

/** @flr-generate all */
export const Option = flowComponent("Option", (props) => {
  const {
    className,
    children,
    textValue = extractTextFromFirstChild(children),
    value = textValue,
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(styles.option, className);
  const hasChildren = Children.count(children) >= 1;

  return (
    <Aria.ListBoxItem
      className={rootClassName}
      ref={ref}
      {...rest}
      textValue={textValue}
      id={value}
      key={value}
    >
      {hasChildren ? children : textValue}
    </Aria.ListBoxItem>
  );
});

export default Option;
