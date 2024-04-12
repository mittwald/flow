import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./LayoutCard.module.scss";
import clsx from "clsx";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface LayoutCardProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "main" | "footer" | "header">,
    FlowComponentProps {}

export const LayoutCard = flowComponent("LayoutCard", (props) => {
  const { children, className, elementType = "div", ref, ...rest } = props;

  const rootClassName = clsx(styles.layoutCard, className);

  const Element = elementType;

  return (
    <Element className={rootClassName} {...rest} ref={ref}>
      {children}
    </Element>
  );
});

export default LayoutCard;
