import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./LayoutCard.module.scss";
import clsx from "clsx";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface LayoutCardProps
  extends PropsWithChildren,
    PropsWithElementType,
    FlowComponentProps {}

export const LayoutCard = flowComponent("LayoutCard", (props) => {
  const { children, className, elementType = "div", ...rest } = props;

  const rootClassName = clsx(styles.layoutCard, className);

  const Element = elementType;

  const propsContext: PropsContext = {
    Tabs: {
      className: styles.tabs,
    },
  };

  return (
    <Element className={rootClassName} {...rest}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Element>
  );
});

export default LayoutCard;
