import { type PropsWithChildren } from "react";
import { Children } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Option.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { extractTextFromFirstChild } from "@/lib/react/remote";
import { IconCheck } from "@/components/Icon/components/icons";

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
      id={value}
      {...rest}
      textValue={textValue}
    >
      <span className={styles.content}>
        {hasChildren ? children : textValue}
      </span>
      <IconCheck aria-hidden className={styles.checkMark} />
    </Aria.ListBoxItem>
  );
});

export default Option;
