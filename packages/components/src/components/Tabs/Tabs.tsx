import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tabs.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface TabsProps extends Aria.TabsProps, FlowComponentProps {}

export const Tabs = flowComponent("Tabs", (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tabs, className);

  return (
    <Aria.Tabs className={rootClassName} {...rest}>
      {children}
    </Aria.Tabs>
  );
});

export default Tabs;
